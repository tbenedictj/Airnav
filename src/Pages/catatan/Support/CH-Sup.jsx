import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { db } from '../../../config/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

const CatatanHarian = () => {
    const navigate = useNavigate();
    const [catatan, setCatatan] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [expandedTeknisi, setExpandedTeknisi] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchCatatan();
    }, []);

    const fetchCatatan = async () => {
        try {
            const q = query(collection(db, 'CH-Sup'), orderBy('createdAt', 'desc'));
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
                await deleteDoc(doc(db, 'CH-Sup', id));
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
    
        const teknisiText = Array.isArray(item.teknisi)
            ? item.teknisi.join(', ').toLowerCase()
            : (typeof item.teknisi === 'string' ? item.teknisi.toLowerCase() : '');
    
        return (
            (`${item.tanggal ?? ''} ${item.jamSelesai ?? ''}`.toLowerCase().includes(searchString)) ||
            (item.peralatan?.toLowerCase().includes(searchString)) ||
            teknisiText.includes(searchString) ||
            (item.status?.toLowerCase().includes(searchString))
        );
    });

    const formatDateTime = (date, time) => {
        if (!date) return '';
        return `${date} ${time || ''}`;
    };

    // Calculate start and end indices for pagination
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const paginatedCatatan = filteredCatatan.slice(startIndex, endIndex);

    // Change page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredCatatan.length / entriesPerPage);

    return (
        <div className="container-fluid flex-col sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">List Data Pemeliharaan Harian Support</h1>

            <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
                <nav className="text-gray-600">
                    <span className="mx-2">/</span>
                    <Link to="/dashboard" className="text-blue-500">Dashboard</Link>
                    <span className="mx-2">/</span>
                    <span>List Data Pemeliharaan Harian Support</span>
                </nav>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-blue-600 mb-4">Pemeliharaan Harian Support</h2>
                <div className="flex justify-between mb-4">
                    <div>
                        <button 
                            onClick={() => navigate('/tambah-ch-sup')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
                        >
                            <i className="fas fa-plus mr-2"></i> Tambah Data
                        </button>
                        <button
                            onClick={() => navigate('/ch-sup-pdf')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            <i className="fas fa-filter mr-2"></i> Filter & Print PDF
                        </button>
                    </div>
                    <div className="flex items-center text-black">
                        <label className="mr-2">Show</label>
                        <select className="border rounded p-1 text-black" value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                            <option>100</option>
                        </select>
                        <span className="ml-2">entries</span>
                    </div>
                </div>
                <div className="flex justify-between mb-4">
                    <div></div>
                    <div className="text-black">
                        <label className="mr-2">Search:</label>
                        <input type="text" className="border rounded p-1" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">Waktu</th>
                                <th className="py-2 px-4 border">Peralatan</th>
                                <th className="py-2 px-4 border">Kegiatan</th>
                                <th className="py-2 px-4 border">Teknisi</th>
                                <th className="py-2 px-4 border">Note</th>
                                <th className="py-2 px-4 border">Paraf</th>
                                <th className="py-2 px-4 border">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                        {paginatedCatatan.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4">
                                    Tidak ada Data
                                </td>
                            </tr>
                        ) : (
                            paginatedCatatan.map((item) => (
                                <tr key={item.id}>
                                    {/* render isi row */}
                                </tr>
                            ))
                        )}
                            {paginatedCatatan.map((item) => (
                                <tr key={item.id}>
                                    <td className="py-2 px-4 border border-gray-300 whitespace-nowrap overflow-hidden overflow-ellipsis">
                                        {formatDateTime(item.tanggal, item.jamSelesai)}
                                    </td>
                                    <td className="py-2 px-4 border">{item.peralatan}</td>
                                    <td className="py-2 px-4 border">
                                        {item.aktivitas?.length > 50 ? (
                                            <div>
                                                <span>
                                                    {expandedRows[item.id] 
                                                        ? item.aktivitas
                                                        : `${item.aktivitas.substring(0, 50)}...`}
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
                                                onClick={() => navigate(`/edit-ch-sup/${item.id}`)}
                                            >
                                                <i className="fas fa-edit text-white text-sm"></i>
                                            </button>
                                            <button 
                                                className="w-[30px] h-[30px] bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                                                onClick={() => navigate(`/detail-ch-sup/${item.id}`)}
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
            <div className="container mx-auto p-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex justify-between items-center text-black">
                        <p>Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, filteredCatatan.length)} of {filteredCatatan.length} entries</p>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50" 
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => handlePageChange(i + 1)} 
                                    className={`px-3 py-1 border border-blue-300 rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)} 
                                className="px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50" 
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="text-center py-4">
                <p className="text-black">Air Nav Manado</p>
            </footer>
        </div>
    );
};

export default CatatanHarian;
