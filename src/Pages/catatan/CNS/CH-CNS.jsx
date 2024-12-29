import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { collection, query, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const CatatanHarian = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRows, setExpandedRows] = useState({});
    const [expandedTeknisi, setExpandedTeknisi] = useState({});
    const [expandedAlat, setExpandedAlat] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const q = query(collection(db, 'CH-CNS'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const documents = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setData(documents);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            try {
                await deleteDoc(doc(db, 'CH-CNS', id));
                await fetchData(); // Refresh data after deletion
                alert('Data berhasil dihapus');
            } catch (error) {
                console.error('Error deleting document:', error);
                alert('Terjadi kesalahan saat menghapus data');
            }
        }
    };

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
        } else if (type === 'peralatan') {
            setExpandedAlat(prev => ({
                ...prev,
                [id]: !prev[id]
            }));
        }
    };

    // Filter data based on search term
    const filteredData = data.filter(item => 
        item.peralatan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.aktivitas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.teknisi?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);

    const formatDateTime = (date, time) => {
        if (!date) return '';
        return `${date} ${time || ''}`;
    };

    return (
        <div className="container-fluid flex-col sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">List Data Pemeliharaan Harian CNS</h1>

            <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
                <nav className="text-gray-600">
                    <span className="mx-2">/</span>
                    <Link to="/dashboard" className="text-blue-500">Dashboard</Link>
                    <span className="mx-2">/</span>
                    <span>List Data Pemeliharaan Harian CNS</span>
                </nav>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg md:text-xl font-semibold text-blue-600 mb-4">Pemeliharaan Harian CNS</h2>
                <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div className="flex flex-wrap mb-4 md:mb-0">
                        <button
                            onClick={() => navigate('/tambah-ch-cns')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2 mb-2 md:mb-0"
                        >
                            <i className="fas fa-plus mr-2"></i> Tambah Data
                        </button>
                        <button 
                            onClick={() => navigate('/ch-cns-pdf')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-2 md:mb-0"
                        >
                            <i className="fas fa-filter mr-2"></i> Filter & Print PDF
                        </button>
                    </div>
                    <div className="flex items-center text-black">
                        <label className="mr-2">Show</label>
                        <select 
                            className="border rounded p-1 text-black"
                            value={entriesPerPage}
                            onChange={(e) => {
                                setEntriesPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span className="ml-2">entries</span>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div></div>
                    <div className="text-black flex items-center">
                        <label className="mr-2">Search:</label>
                        <input 
                            type="text" 
                            className="border rounded p-1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto max-w-full">
                    <table className="min-w-full border border-gray-300 border-collapse bg-white table-fixed">
                        <thead>
                            <tr className="text-black">
                                <th className="py-2 px-4 border border-gray-300 ">Tanggal / Jam</th>
                                <th className="py-2 px-4 border border-gray-300 ">Alat</th>
                                <th className="py-2 px-4 border border-gray-300 ">Kegiatan</th>
                                <th className="py-2 px-4 border border-gray-300 ">Teknisi</th>
                                <th className="py-2 px-4 border border-gray-300 ">Note</th>
                                <th className="py-2 px-4 border border-gray-300 ">Paraf</th>
                                <th className="py-2 px-4 border border-gray-300 ">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-black">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">Loading...</td>
                                </tr>
                            ) : currentEntries.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">Tidak ada data</td>
                                </tr>
                            ) : (
                                currentEntries.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-2 px-4 border border-gray-300 whitespace-nowrap overflow-hidden overflow-ellipsis">
                                            {formatDateTime(item.tanggal, item.jamSelesai)}
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300 max-w-[150px] whitespace-nowrap overflow-hidden overflow-ellipsis">
                                            <div className="break-words whitespace-pre-wrap">
                                            {item.peralatan?.length > 20 ? (
                                                <>
                                                    <span>
                                                        {expandedAlat[item.id]
                                                            ? item.peralatan
                                                            : `${item.peralatan.substring(0, 20)}...`
                                                        }
                                                    </span>
                                                    <span
                                                        className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm block mt-1"
                                                        onClick={() => toggleRowExpansion(item.id, 'peralatan')}
                                                    >
                                                        {expandedRows[item.id] ? 'Sembunyikan' : 'Selengkapnya'}
                                                    </span>
                                                </>
                                            ) : (
                                                <span>{item.peralatan}</span>
                                            )}
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300 max-w-[300px]">
                                            <div className="break-words whitespace-pre-wrap">
                                                {item.aktivitas?.length > 50 ? (
                                                    <>
                                                        <span>
                                                            {expandedRows[item.id] 
                                                                ? item.aktivitas
                                                                : `${item.aktivitas.substring(0, 50)}...`
                                                            }
                                                        </span>
                                                        <span 
                                                            className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm block mt-1"
                                                            onClick={() => toggleRowExpansion(item.id, 'aktivitas')}
                                                        >
                                                            {expandedRows[item.id] ? 'Sembunyikan' : 'Selengkapnya'}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span>{item.aktivitas}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300 max-w-[128px]">
                                            <div className="break-words whitespace-pre-wrap">
                                                {item.teknisi?.length > 20 ? (
                                                    <>
                                                        <span>
                                                            {expandedTeknisi[item.id] 
                                                                ? item.teknisi
                                                                : `${item.teknisi.substring(0, 20)}...`
                                                            }
                                                        </span>
                                                        <span 
                                                            className="text-blue-600 cursor-pointer hover:text-blue-800 text-sm block mt-1"
                                                            onClick={() => toggleRowExpansion(item.id, 'teknisi')}
                                                        >
                                                            {expandedTeknisi[item.id] ? 'Sembunyikan' : 'Selengkapnya'}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span>{item.teknisi}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <div className="max-h-20 overflow-y-auto break-words">
                                                {item.note || '-'}
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300 text-center">
                                            {item.bukti && (
                                                <img
                                                    src={item.bukti}
                                                    alt="Paraf"
                                                    className="w-12 h-12 object-contain cursor-pointer mx-auto"
                                                    onClick={() => window.open(item.bukti, '_blank')}
                                                />
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <div className="flex space-x-2 justify-center">
                                                <button 
                                                    className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600 rounded flex items-center justify-center"
                                                    onClick={() => navigate(`/edit-ch-cns/${item.id}`)}
                                                >
                                                    <i className="fas fa-edit text-white text-sm"></i>
                                                </button>
                                                <button 
                                                    className="w-[30px] h-[30px] bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                                                    onClick={() => navigate(`/detail-ch-cns/${item.id}`)}
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="container mx-auto p-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between items-center text-black">
                        <p>
                            Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredData.length)} of {filteredData.length} entries
                        </p>
                        <div className="flex space-x-2 mt-4 md:mt-0">
                            <button 
                                className={`px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    className={`px-3 py-1 border border-blue-300 rounded-md ${
                                        currentPage === index + 1 ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'
                                    }`}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button 
                                className={`px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
