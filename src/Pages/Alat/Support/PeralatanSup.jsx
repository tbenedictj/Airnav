import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import '@fortawesome/fontawesome-free/css/all.min.css';

const PeralatanSup = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState('10');
    const [searchTerm, setSearchTerm] = useState('');
    const [peralatanSup, setPeralatanSup] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

    useEffect(() => {
        const fetchPeralatanSup = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'PeralatanSupport'));
                const peralatanData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPeralatanSup(peralatanData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPeralatanSup();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteDoc(doc(db, 'PeralatanSupport', id));
                setPeralatanSup(peralatanSup.filter(alat => alat.id !== id));
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

    const sortedPeralatanSup = () => {
        if (!sortField) return peralatanSup;
        return peralatanSup.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortField].localeCompare(b[sortField]);
            } else {
                return b[sortField].localeCompare(a[sortField]);
            }
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container-fluid mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">List Peralatan Support</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-blue-600 text-lg font-semibold mb-4">Peralatan Support</h2>

                <div className="flex justify-between flex-wrap gap-4 mb-6">
                    <button
                        onClick={() => navigate('/tambah-alat-support')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                    >
                        + Tambah Alat
                    </button>
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center text-sm sm:text-base">
                            <span className="mr-2">Show</span>
                            <select
                                className="border rounded px-2 py-1"
                                value={entries}
                                onChange={(e) => setEntries(e.target.value)}
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
                                    <button onClick={() => handleSort('SNOutdoor')} className="bg-transparent text-black ml-2 hover:text-gray-700">
                                        SN Outdoor&nbsp;↕
                                    </button>
                                </th>
                                <th className="border-gray-300 border-r px-4 py-2 text-left text-sm sm:text-base">
                                    <button onClick={() => handleSort('SNIndoor')} className="bg-transparent text-black ml-2 hover:text-gray-700">
                                        SN Indoor&nbsp;↕
                                    </button>
                                </th>
                                <th className="border-gray-300 border-r px-4 py-2 text-left text-sm sm:text-base">
                                    <button onClick={() => handleSort('Tahun')} className="bg-transparent text-black ml-2 hover:text-gray-700">
                                        Tahun&nbsp;↕
                                    </button>
                                </th>
                                <th className="border-gray-300 border-r px-4 py-2 text-left text-sm sm:text-base">Status</th>
                                <th className="px-4 py-2 text-center text-sm sm:text-base">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPeralatanSup().map((alat) => (
                                <tr key={alat.id} className="hover:bg-gray-50 border-b border-gray-300">
                                    <td className="border-gray-300 border-r px-4 py-2 text-sm sm:text-base">{alat.namaAlat}</td>
                                    <td className="border-gray-300 border-r px-4 py-2 text-sm sm:text-base">{alat.kategoriAlat}</td>
                                    <td className="border-gray-300 border-r px-4 py-2 text-sm sm:text-base">{alat.SNOutdoor}</td>
                                    <td className="border-gray-300 border-r px-4 py-2 text-sm sm:text-base">{alat.SNIndoor}</td>
                                    <td className="border-gray-300 border-r px-4 py-2 text-sm sm:text-base">{alat.Tahun}</td>
                                    <td className="border-gray-300 border-r px-4 py-2">
                                        <span className={`px-2 py-1 rounded text-xs sm:text-sm ${alat.status === 'open' ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white'}`}>
                                            {alat.status === 'open' ? 'Maintenance' : 'Normal Ops'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 w-[110px] space-x-1 flex">
                                        <button className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600 text-white text-sm rounded flex items-center justify-center">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="w-[30px] h-[30px] bg-red-500 hover:bg-red-600 text-white text-sm rounded flex items-center justify-center"
                                            onClick={() => handleDelete(alat.id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
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

export default PeralatanSup;
