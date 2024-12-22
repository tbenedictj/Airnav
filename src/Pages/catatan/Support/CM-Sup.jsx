import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { db } from '../../../config/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

const CatatanMingguan = () => {
    const navigate = useNavigate();
    const [catatan, setCatatan] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [expandedTeknisi, setExpandedTeknisi] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCatatan();
    }, []);

    const fetchCatatan = async () => {
        try {
            const q = query(collection(db, 'CM-Sup'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const catatanData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCatatan(catatanData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
            try {
                await deleteDoc(doc(db, 'CM-Sup', id));
                fetchCatatan();
            } catch (error) {
                console.error('Error deleting document:', error);
            }
        }
    };

    const toggleRow = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleTeknisi = (id) => {
        setExpandedTeknisi(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const filteredCatatan = catatan.filter(item => {
        const searchString = searchTerm.toLowerCase();
        return (
            item.waktu?.toLowerCase().includes(searchString) ||
            item.peralatan?.toLowerCase().includes(searchString) ||
            item.aktivitas?.toLowerCase().includes(searchString) ||
            (Array.isArray(item.teknisi) ? item.teknisi.join(', ').toLowerCase().includes(searchString) : false) ||
            item.status?.toLowerCase().includes(searchString)
        );
    });

    return (
        <div className="container-fluid flex-col sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">List Data Pemeliharaan Mingguan Support</h1>
            
            <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
                <nav className="text-gray-600">
                    <span className="mx-2">/</span>
                    <Link to="/dashboard" className="text-blue-500">Dashboard</Link>
                    <span className="mx-2">/</span>
                    <span>List Data Pemeliharaan Mingguan Support</span>
                </nav>
            </div>            
            
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-blue-600 mb-4">Pemeliharaan Mingguan Support</h2>
                <div className="flex justify-between mb-4">
                    <div>
                        <button 
                            onClick={() => navigate('/tambah-cm-sup')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
                        >
                            <i className="fas fa-plus mr-2"></i> Tambah Data
                        </button>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border rounded px-2 py-1 mr-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">Waktu</th>
                                <th className="py-2 px-4 border">Peralatan</th>
                                <th className="py-2 px-4 border">Aktivitas</th>
                                <th className="py-2 px-4 border">Teknisi</th>
                                <th className="py-2 px-4 border">Note</th>
                                <th className="py-2 px-4 border">Paraf</th>
                                <th className="py-2 px-4 border">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCatatan.map((item) => (
                                <tr key={item.id}>
                                    <td className="py-2 px-4 border">{item.waktu}</td>
                                    <td className="py-2 px-4 border">{item.peralatan}</td>
                                    <td className="py-2 px-4 border">
                                        {item.aktivitas?.length > 100 ? (
                                            <div>
                                                <span>
                                                    {expandedRows[item.id] 
                                                        ? item.aktivitas
                                                        : `${item.aktivitas.substring(0, 100)}...`}
                                                </span>
                                                <button 
                                                    className="text-blue-600 hover:text-blue-800 text-sm block mt-1"
                                                    onClick={() => toggleRow(item.id)}
                                                >
                                                    {expandedRows[item.id] ? 'Sembunyikan' : 'Selengkapnya'}
                                                </button>
                                            </div>
                                        ) : (
                                            item.aktivitas
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border">
                                        {Array.isArray(item.teknisi) ? (
                                            item.teknisi.join(', ').length > 20 ? (
                                                <div>
                                                    <span>
                                                        {expandedTeknisi[item.id] 
                                                            ? item.teknisi.join(', ')
                                                            : `${item.teknisi.join(', ').substring(0, 20)}...`}
                                                    </span>
                                                    <button 
                                                        className="text-blue-600 hover:text-blue-800 text-sm block mt-1"
                                                        onClick={() => toggleTeknisi(item.id)}
                                                    >
                                                        {expandedTeknisi[item.id] ? 'Sembunyikan' : 'Selengkapnya'}
                                                    </button>
                                                </div>
                                            ) : (
                                                item.teknisi.join(', ')
                                            )
                                        ) : (
                                            item.teknisi
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border">{item.status}</td>
                                    <td className="py-2 px-4 border">
                                        {item.paraf && (
                                            <img src={item.paraf} alt="Paraf" className="w-24 h-12 mx-auto" />
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border">
                                        <div className="flex space-x-2 justify-center">
                                            <button 
                                                className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600 rounded flex items-center justify-center"
                                                onClick={() => navigate(`/edit-cm-sup/${item.id}`)}
                                            >
                                                <i className="fas fa-edit text-white text-sm"></i>
                                            </button>
                                            <button 
                                                className="w-[30px] h-[30px] bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                                                onClick={() => navigate(`/detail-cm-sup/${item.id}`)}
                                            >
                                                <i className="fas fa-file text-white text-sm"></i>
                                            </button>
                                            <button 
                                                className="w-[30px] h-[30px] bg-red-500 hover:bg-red-600 rounded flex items-center justify-center"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <i className="fas fa-trash text-white text-sm"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CatatanMingguan;