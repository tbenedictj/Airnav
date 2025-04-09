import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';

const API_URL = 'http://localhost:5000/api';

const CatatanBulanan = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState({});
    const [expandedTeknisi, setExpandedTeknisi] = useState({});

    // Fetch data
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/support/CB`);
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
                await axios.delete(`${API_URL}/support/CB/${id}`);
                setData(prevData => prevData.filter(item => item.id !== id));
                alert("Record deleted successfully");
            } catch (error) {
                console.error("Error deleting record:", error);
                alert("Failed to delete record");
            }
        }
    };

    // Filter data based on search term
    const filteredData = data.filter(item =>
        item.waktu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.peralatan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.aktivitas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(item.teknisi) ? item.teknisi.join(', ').toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
        item.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div className="container-fluid flex-col sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">List Data Pemeliharaan Bulanan Support</h1>
            
            <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
                <nav className="text-gray-600">
                    <span className="mx-2">/</span>
                    <Link to="/dashboard" className="text-blue-500">Dashboard</Link>
                    <span className="mx-2">/</span>
                    <span>List Data Pemeliharaan Bulanan Support</span>
                </nav>
            </div>            
            
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-blue-600 mb-4">Pemeliharaan Bulanan Support</h2>
                <div className="flex justify-between mb-4">
                    <div>
                        <button 
                            onClick={() => navigate('/tambah-cb-sup')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Tambah Data
                        </button>
                        <button
                            onClick={() => navigate('/cb-sup-pdf')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            <FontAwesomeIcon icon={faEye} className="mr-2" />
                            Filter & Print PDF
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
                            {filteredData.map((item) => (
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
                                                <span 
                                                    className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer block mt-1"
                                                    onClick={() => toggleRow(item.id)}
                                                >
                                                    {expandedRows[item.id] ? 'Sembunyikan' : 'Selengkapnya'}
                                                </span>
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
                                                    <span 
                                                        className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer block mt-1"
                                                        onClick={() => toggleTeknisi(item.id)}
                                                    >
                                                        {expandedTeknisi[item.id] ? 'Sembunyikan' : 'Selengkapnya'}
                                                    </span>
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
                                                onClick={() => navigate(`/edit-cb-sup/${item.id}`)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="text-white text-sm"></FontAwesomeIcon>
                                            </button>
                                            <button 
                                                className="w-[30px] h-[30px] bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                                                onClick={() => navigate(`/detail-cb-sup/${item.id}`)}
                                            >
                                                <FontAwesomeIcon icon={faEye} className="text-white text-sm"></FontAwesomeIcon>
                                            </button>
                                            <button 
                                                className="w-[30px] h-[30px] bg-red-500 hover:bg-red-600 rounded flex items-center justify-center"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-white text-sm"></FontAwesomeIcon>
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

export default CatatanBulanan;
