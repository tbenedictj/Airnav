import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import '@fortawesome/fontawesome-free/css/all.min.css';

const PeralatanCNS = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState('10');
    const [searchTerm, setSearchTerm] = useState('');
    const [peralatan, setPeralatan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setPeralatan(peralatan.filter(alat => alat.id !== id)); // Update local state
                alert('Data berhasil dihapus.');
            } catch (err) {
                console.error('Error deleting document:', err);
                alert('Terjadi kesalahan saat menghapus data.');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">List Peralatan CNS</h1>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-blue-600 text-lg font-semibold mb-4">Peralatan CNS</h2>

                {/* Add Button */}
                <div className="flex justify-between flex-wrap gap-4 mb-6">
                    <button
                        onClick={() => navigate('/tambah-alat-cns')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                    >
                        + Tambah Alat
                    </button>

                    {/* Entries and Search Controls */}
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

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="text-black border-b border-gray-300 bg-gray-100">
                                <th className="border-gray-300 w-[300px] border-r px-4 py-2 text-left text-sm sm:text-base">Nama Alat ↕</th>
                                <th className="border-gray-300 w-[200px] border-r px-4 py-2 text-left text-sm sm:text-base">Kategori ↕</th>
                                <th className="border-gray-300 w-[150px] border-r px-4 py-2 text-left text-sm sm:text-base">Frekuensi ↕</th>
                                <th className="border-gray-300 border-r px-4 py-2 text-left text-sm sm:text-base">Status ↕</th>
                                <th className="px-4 py-2 text-center text-sm sm:text-base">Action ↕</th>
                            </tr>
                        </thead>
                        <tbody>
                            {peralatan.map((alat) => (
                                <tr key={alat.id} className="hover:bg-gray-50 border-b border-gray-300">
                                    <td className="border-gray-300 border-r px-4 py-2 text-sm sm:text-base">{alat.namaAlat}</td>
                                    <td className="border-gray-300 border-r px-4 py-2 text-sm sm:text-base">{alat.kategoriAlat}</td>
                                    <td className="border-gray-300 border-r px-4 py-2 text-sm sm:text-base">{alat.frekuensi}</td>
                                    <td className="px-4 py-2">
                                        <span className={`bg-${alat.status === 'open' ? 'yellow-500' : 'green-600'} text-white px-2 py-1 rounded text-xs sm:text-sm`}>
                                            {alat.status === 'open' ? 'Maintenance' : 'Normal ops'}
                                        </span>
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                        <button className="text-blue-500 hover:text-blue-700 mx-1">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="text-red-500 hover:text-red-700 mx-1" onClick={() => handleDelete(alat.id)}>
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

export default PeralatanCNS;
