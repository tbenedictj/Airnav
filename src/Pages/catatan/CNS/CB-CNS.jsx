import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye, faPlus } from '@fortawesome/free-solid-svg-icons';

const API_URL = 'http://localhost:5000/api';

const CatatanBulanan = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRows, setExpandedRows] = useState({});
    const [expandedTeknisi, setExpandedTeknisi] = useState({});
    const [expandedAlat, setExpandedAlat] = useState({});

    // Fetch data
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/cns/CB`);
            setData(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Delete record
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await axios.delete(`${API_URL}/cns/CB/${id}`);
                setData(prevList => prevList.filter(item => item.id !== id));
                alert("Record deleted successfully");
            } catch (error) {
                console.error("Error deleting record:", error);
                alert("Failed to delete record");
            }
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="container-fluid flex-col sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">List Data Pemeliharaan Bulanan CNS</h1>

            <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
                <nav className="text-gray-600">
                    <span className="mx-2">/</span>
                    <Link to="/dashboard" className="text-blue-500">Dashboard</Link>
                    <span className="mx-2">/</span>
                    <span>List Data Pemeliharaan Bulanana CNS</span>
                </nav>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg md:text-xl font-semibold text-blue-600 mb-4">Pemeliharaan Bulanan CNS</h2>
                <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div className="flex flex-wrap mb-4 md:mb-0">
                        <button
                            onClick={() => navigate('/tambah-cb-cns')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2 mb-2 md:mb-0"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Tambah Data
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-2 md:mb-0">
                            <FontAwesomeIcon icon={faEye} className="mr-2" /> Filter & Print PDF
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
                                <th className="py-2 px-4 border border-gray-300">Tanggal / Jam</th>
                                <th className="py-2 px-4 border border-gray-300">Alat</th>
                                <th className="py-2 px-4 border border-gray-300">Kegiatan</th>
                                <th className="py-2 px-4 border border-gray-300">Teknisi</th>
                                <th className="py-2 px-4 border border-gray-300">Note</th>
                                <th className="py-2 px-4 border border-gray-300">Paraf</th>
                                <th className="py-2 px-4 border border-gray-300">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-black">
                            {currentEntries.length === 0 ? (
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
                                                            {expandedAlat[item.id] ? 'Sembunyikan' : 'Selengkapnya'}
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
                                                    onClick={() => navigate(`/edit-cb-cns/${item.id}`)}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} className="text-white text-sm" />
                                                </button>
                                                <button 
                                                    className="w-[30px] h-[30px] bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                                                    onClick={() => navigate(`/detail-cb-cns/${item.id}`)}
                                                >
                                                    <FontAwesomeIcon icon={faEye} className="text-white text-sm" />
                                                </button>
                                                <button 
                                                    className="w-[30px] h-[30px] bg-red-500 hover:bg-red-600 rounded flex items-center justify-center"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} className="text-white text-sm" />
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

export default CatatanBulanan;
