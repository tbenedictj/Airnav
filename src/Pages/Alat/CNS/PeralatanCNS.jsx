import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const PeralatanCNS = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState('10');
    const [searchTerm, setSearchTerm] = useState('');
    const [peralatan, setPeralatan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchPeralatan = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'PeralatanCNS'));
                const peralatanData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPeralatan(peralatanData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPeralatan();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteDoc(doc(db, 'PeralatanCNS', id));
                setPeralatan(peralatan.filter(alat => alat.id !== id));
                alert('Data berhasil dihapus.');
            } catch (err) {
                console.error('Error deleting document:', err);
                alert('Terjadi kesalahan saat menghapus data.');
            }
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getFilteredAndSortedPeralatan = () => {
        let filtered = peralatan.filter((alat) =>
            (alat.status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (alat.status === 'open' ? 'maintenance' : 'normal ops').includes(searchTerm.toLowerCase()) ||
            (alat.namaAlat || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (alat.kategoriAlat || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (alat.frekuensi || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (!sortField) return filtered;

        return filtered.sort((a, b) => {
            const aVal = a[sortField] || '';
            const bVal = b[sortField] || '';
            return sortOrder === 'asc'
                ? aVal.toString().localeCompare(bVal.toString())
                : bVal.toString().localeCompare(aVal.toString());
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Pagination
    const filteredData = getFilteredAndSortedPeralatan();
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container-fluid flex-col sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">List Peralatan CNS</h1>

            <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
                <nav className="text-gray-600">
                    <span className="mx-2">/</span>
                    <Link to="/dashboard" className="text-blue-500">Dashboard</Link>
                    <span className="mx-2">/</span>
                    <span>List Peralatan CNS</span>
                </nav>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-blue-600 text-lg font-semibold mb-4">Peralatan CNS</h2>

                <div className="flex justify-between flex-wrap gap-4 mb-6">
                    <button
                        onClick={() => navigate('/tambah-alat-cns')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                    >
                        + Tambah Alat
                    </button>

                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center text-sm sm:text-base">
                            <span className="mr-2">Show</span>
                            <select
                                className="border rounded px-2 py-1"
                                value={entriesPerPage}
                                onChange={(e) => {
                                    setEntriesPerPage(parseInt(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <span className="ml-2">entries</span>
                        </div>
                        <div className="flex items-center text-sm sm:text-base">
                            <span className="mr-2">Search:</span>
                            <input
                                type="text"
                                className="border rounded px-2 py-1 w-32 sm:w-48"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="text-black border-b border-gray-300 bg-gray-100">
                                <th className="text-center border-gray-300 border-r px-4 py-2 text-left text-sm sm:text-base">
                                    <button onClick={() => handleSort('namaAlat')} className="bg-transparent text-black ml-2 hover:text-gray-700">
                                        Nama&nbsp;↕
                                    </button>
                                </th>
                                <th className="border-gray-300 border-r px-4 py-2 text-left text-sm sm:text-base">
                                    <button onClick={() => handleSort('kategoriAlat')} className="bg-transparent text-black ml-2 hover:text-gray-700">
                                        Kategori&nbsp;↕
                                    </button>
                                </th>
                                <th className="border-gray-300 border-r px-4 py-2 text-left text-sm sm:text-base">
                                    <button onClick={() => handleSort('kategoriAlat')} className="bg-transparent text-black ml-2 hover:text-gray-700">
                                        Frekuensi&nbsp;↕
                                    </button>
                                </th>
                                <th className="border-gray-300 border-r px-4 py-2 text-left text-sm sm:text-base">
                                    Status
                                </th>
                                <th className="px-4 py-2 text-center text-sm sm:text-base">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentEntries.length > 0 ? (
                                currentEntries.map((alat) => (
                                    <tr key={alat.id} className="hover:bg-gray-50 border-b border-gray-300">
                                        <td className="border-gray-300 border-r px-4 py-2 text-sm sm:text-base">{alat.namaAlat}</td>
                                        <td className="border-gray-300 border-r px-4 py-2 text-sm sm:text-base">{alat.kategoriAlat}</td>
                                        <td className="border-gray-300 border-r px-4 py-2 text-sm sm:text-base">{alat.frekuensi}</td>
                                        <td className="border-gray-300 border-r px-4 py-2">
                                            <span className={`px-2 py-1 rounded text-xs sm:text-sm ${alat.status === 'open' ? 'bg-yellow-500' : 'bg-green-600'} text-white`}>
                                                {alat.status === 'open' ? 'Maintenance' : 'Normal ops'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 w-[110px] space-x-1 flex">
                                            <button
                                                onClick={() => navigate(`/edit-alat-cns/${alat.id}`)}
                                                className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600 rounded flex items-center justify-center"
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="text-white text-sm" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(alat.id)}
                                                className="w-[30px] h-[30px] bg-red-500 hover:bg-red-600 rounded flex items-center justify-center"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-white text-sm" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        Tidak ada data
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="container mx-auto p-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex justify-between items-center text-black">
                        <p>
                            Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, filteredData.length)} of {filteredData.length} entries
                        </p>
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
                                    className={`px-3 py-1 border border-blue-300 rounded-md ${
                                        currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'
                                    }`}
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

export default PeralatanCNS;
