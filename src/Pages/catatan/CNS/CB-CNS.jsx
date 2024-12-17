import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { db } from '../../../config/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

const CatatanBulanan = () => {
    const navigate = useNavigate();
    const [catatanList, setCatatanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [expandedRows, setExpandedRows] = useState({});
    const [expandedTeknisi, setExpandedTeknisi] = useState({});

    const toggleRowExpansion = (id, type) => {
        if (type === 'aktivitas') {
            setExpandedRows(prev => ({
                ...prev,
                [id]: !prev[id]
            }));
        } else if (type === 'teknisi') {
            setExpandedTeknisi(prev => ({
                ...prev,
                [id]: !prev[id]
            }));
        }
    };

    const fetchCatatan = async () => {
        try {
            const catatanRef = collection(db, 'CB-CNS');
            const q = query(catatanRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const catatan = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCatatanList(catatan);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching catatan:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            try {
                await deleteDoc(doc(db, 'CB-CNS', id));
                await fetchCatatan(); // Refresh data after deletion
                alert('Data berhasil dihapus');
            } catch (error) {
                console.error('Error deleting document:', error);
                alert('Terjadi kesalahan saat menghapus data');
            }
        }
    };

    useEffect(() => {
        fetchCatatan();
    }, []);

    // Filter catatan based on search term
    const filteredCatatan = catatanList.filter(catatan =>
        catatan.peralatan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        catatan.aktivitas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(catatan.teknisi) ? 
            catatan.teknisi.join(' ').toLowerCase().includes(searchTerm.toLowerCase()) :
            catatan.teknisi?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container-fluid flex-col sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">List Data Pemeliharaan Bulanan CNS</h1>
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-blue-600 mb-4">Pemeliharaan Bulanan CNS</h2>
                <div className="flex justify-between mb-4">
                    <div>
                        <button 
                            onClick={() => navigate('/tambah-cb-cns')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
                        >
                            <i className="fas fa-plus mr-2"></i> Tambah Data
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                            <i className="fas fa-filter mr-2"></i> Filter & Print PDF
                        </button>
                    </div>
                    <div className="flex items-center text-black">
                        <label className="mr-2">Show</label>
                        <select 
                            className="border rounded p-1 text-black" 
                            value={entriesPerPage} 
                            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        >
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
                        <input 
                            type="text" 
                            className="border rounded p-1" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="text-black">
                            <th className="py-2 px-4 border-b">Tanggal / Jam</th>
                            <th className="py-2 px-4 border-b">Alat</th>
                            <th className="py-2 px-4 border-b">Kegiatan</th>
                            <th className="py-2 px-4 border-b">Teknisi</th>
                            <th className="py-2 px-4 border-b">Note</th>
                            <th className="py-2 px-4 border-b">Paraf</th>
                            <th className="py-2 px-4 border-b">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {filteredCatatan.slice(0, entriesPerPage).map((catatan) => (
                            <tr key={catatan.id}>
                                <td className="py-2 px-4 border-b">
                                    {catatan.tanggal} {catatan.jamSelesai}
                                </td>
                                <td className="py-2 px-4 border-b">{catatan.peralatan}</td>
                                <td className="py-2 px-4 border-b">
                                    {catatan.aktivitas?.length > 100 ? (
                                        <>
                                            <span>
                                                {expandedRows[catatan.id] 
                                                    ? catatan.aktivitas
                                                    : `${catatan.aktivitas.substring(0, 100)}...`
                                                }
                                            </span>
                                            <button 
                                                className="text-blue-600 hover:text-blue-800 text-sm block mt-1"
                                                onClick={() => toggleRowExpansion(catatan.id, 'aktivitas')}
                                            >
                                                {expandedRows[catatan.id] ? 'Sembunyikan' : 'Selengkapnya'}
                                            </button>
                                        </>
                                    ) : (
                                        catatan.aktivitas
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {Array.isArray(catatan.teknisi) ? (
                                        catatan.teknisi.join(', ').length > 20 ? (
                                            <>
                                                <span>
                                                    {expandedTeknisi[catatan.id] 
                                                        ? catatan.teknisi.join(', ')
                                                        : `${catatan.teknisi.join(', ').substring(0, 20)}...`
                                                    }
                                                </span>
                                                <button 
                                                    className="text-blue-600 hover:text-blue-800 text-sm block mt-1"
                                                    onClick={() => toggleRowExpansion(catatan.id, 'teknisi')}
                                                >
                                                    {expandedTeknisi[catatan.id] ? 'Sembunyikan' : 'Selengkapnya'}
                                                </button>
                                            </>
                                        ) : (
                                            catatan.teknisi.join(', ')
                                        )
                                    ) : (
                                        catatan.teknisi || '-'
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">{catatan.note || '-'}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    {catatan.signatureUrl && (
                                        <img src={catatan.signatureUrl} className="w-12 h-12 object-contain mx-auto" alt="Paraf" />
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div className="flex space-x-2">
                                        <button className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600 rounded flex items-center justify-center">
                                            <i className="fas fa-edit text-white text-sm"></i>
                                        </button>
                                        <button className="w-[30px] h-[30px] bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center">
                                            <i className="fas fa-file text-white text-sm"></i>
                                        </button>
                                        <button 
                                            className="w-[30px] h-[30px] bg-red-500 hover:bg-red-600 rounded flex items-center justify-center"
                                            onClick={() => handleDelete(catatan.id)}
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
            <div className="container mx-auto p-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between items-center text-black">
                        <p>Showing 1 to {entriesPerPage} of {filteredCatatan.length} entries</p>
                        <div className="flex space-x-2 mt-4 md:mt-0">
                            <button className="px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50">Previous</button>
                            <button className="px-3 py-1 border border-blue-300 rounded-md bg-blue-600 text-white">1</button>
                            <button className="px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50">2</button>
                            <button className="px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50">3</button>
                            <button className="px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50">Next</button>
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

export default CatatanBulanan;
