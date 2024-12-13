import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Tambah Data Peralatan CNS</h1>
            
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
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">SN Outdoor</label>
                    <select
                        name="SNOutdoor"
                        value={formData.SNOutdoor}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
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
        </div>
    );
}

export default TambahAlatSup;
