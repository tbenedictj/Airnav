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
            await addDoc(collection(db, 'PeralatanSupport'), formData);
            navigate('/peralatan-sup'); // Navigate back to equipment list
        } catch (error) {
            console.error("Error adding equipment: ", error);
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
                        <option value="Elektrikal">Elektrikal</option>
                        <option value="Mekanikal">Mekanikal</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">SN Indoor</label>
                    <input
                        type="text"
                        name="SNIndoor"
                        value={formData.SNIndoor}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">SN outdoor</label>
                    <input
                        type="text"
                        name="SNOutdoor"
                        value={formData.SNOutdoor}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Status</label>
                    <select
                        name="Status"
                        value={formData.Status}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="close">Close</option>
                        <option value="open">Open</option>
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
