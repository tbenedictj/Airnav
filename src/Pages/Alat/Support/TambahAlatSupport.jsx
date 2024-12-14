import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

function TambahAlatSup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        namaAlat: '',
        kategoriAlat: 'Elektrikal',
        SNIndoor: '',
        SNOutdoor: '',
        Status: 'Close',
        Tahun: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'peralatanSupport'), formData);
            navigate('/peralatan-sup'); // Navigate back to equipment list
        } catch (error) {
            console.error("Error adding equipment: ", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteDoc(doc(db, 'peralatanSupport', id));
                alert('Data berhasil dihapus.');
            } catch (err) {
                console.error('Error deleting document:', err);
                alert('Terjadi kesalahan saat menghapus data.');
            }
        }
    };

    return (
        <div className="container mt-40 w-screen max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Tambah Data Peralatan CNS</h1>
            
            {/* Breadcrumb */}
            <div className="bg-gray-100 p-3 rounded-lg mb-6">
                <nav className="text-gray-600">
                    <span className="mx-2">/</span>
                    <Link to="/peralatan-sup" className="text-blue-500">List Peralatan Support</Link>
                    <span className="mx-2">/</span>
                    <span>Add Peralatan Support</span>
                </nav>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 mb-2">Nama Alat</label>
                    <input
                        type="text"
                        name="namaAlat"
                        value={formData.namaAlat}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Kategori Alat</label>
                    <select
                        name="kategoriAlat"
                        value={formData.kategoriAlat}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="Communication">Elektrikal</option>
                        <option value="Navigation">Mekanikal</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">SN Indoor</label>
                    <select
                        name="SNIndoor"
                        value={formData.SNIndoor}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Select SN Indoor</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">SN Outdoor</label>
                    <select
                        name="SNOutdoor"
                        value={formData.SNOutdoor}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Select SN Outdoor</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Status</label>
                    <select
                        name="status"
                        value={formData.Status}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="Close">Close</option>
                        <option value="Open">Open</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Tahun</label>
                    <input
                        name="Tahun"
                        value={formData.Tahun}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                    >
                        Simpan
                    </button>
                    <Link
                        to="/peralatan-sup"
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
                    >
                        Kembali
                    </Link>
                </div>
            </form>
            <div className="mt-6">
                <h2 className="text-blue-600 text-lg font-semibold mb-4">List Peralatan Support</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="text-black border-b border-gray-300 bg-gray-100">
                                <th className="border-gray-300 w-[300px] border-r px-4 py-2 text-left text-sm sm:text-base">Nama Alat ↕</th>
                                <th className="border-gray-300 w-[200px] border-r px-4 py-2 text-left text-sm sm:text-base">Kategori ↕</th>
                                <th className="border-gray-300 border-r px-4 py-2 text-left text-sm sm:text-base">Status ↕</th>
                                <th className="px-4 py-2 text-center text-sm sm:text-base">Action ↕</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getDocs(collection(db, 'peralatanSupport')).then(querySnapshot => {
                                const alatData = querySnapshot.docs.map(doc => ({
                                    id: doc.id,
                                    ...doc.data()
                                }));
                                return alatData.map((alat) => (
                                    <tr key={alat.id} className="hover:bg-gray-50 border-b border-gray-300">
                                        <td className="border-gray-300 border-r px-4 py-2 text-sm sm:text-base">{alat.namaAlat}</td>
                                        <td className="border-gray-300 border-r px-4 py-2 text-sm sm:text-base">{alat.kategoriAlat}</td>
                                        <td className="px-4 py-2">
                                            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs sm:text-sm">
                                                {alat.status}
                                            </span>
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                            <button className="text-red-500 hover:text-red-700 mx-1" onClick={() => handleDelete(alat.id)}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ));
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TambahAlatSup;
