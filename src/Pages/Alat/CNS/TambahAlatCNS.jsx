import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../../config/firebase';
import '@fortawesome/fontawesome-free/css/all.min.css';

function TambahAlatCNS() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        namaAlat: '',
        kategoriAlat: 'Communication',
        status: 'Close',
        frekuensi: ''
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
        setIsLoading(true);

        if (!auth.currentUser) {
            alert("Anda harus login terlebih dahulu!");
            navigate('/loginform');
            return;
        }

        try {
            // Add document to Firestore
            const docRef = await addDoc(collection(db, "PeralatanCNS"), {
                ...formData,
                createdAt: new Date().toISOString(),
                createdBy: auth.currentUser.uid
            });

            console.log("Document written with ID: ", docRef.id);
            alert(`Peralatan ${formData.namaAlat} berhasil ditambahkan ke database.`);
            navigate('/peralatan-cns');
        } catch (error) {
            console.error("Error adding equipment:", error);
            alert(`Terjadi kesalahan saat menyimpan data peralatan: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid flex-col sticky max-w-4xl w-screen sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-black text-left">Tambah Data Peralatan CNS</h1>
            
            {/* Breadcrumb */}
            <div className="bg-gray-100 p-3 rounded-lg mb-6">
                <nav className="text-gray-600">
                    <span className="mx-2">/</span>
                    <Link to="/peralatan-cns" className="text-blue-500">List Peralatan CNS</Link>
                    <span className="mx-2">/</span>
                    <span>Add Peralatan CNS</span>
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
                        <option value="Communication">Communication</option>
                        <option value="Navigation">Navigation</option>
                        <option value="Surveillance">Surveillance</option>
                        <option value="Data Processing">Data Processing</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="close">Close</option>
                        <option value="open">Open</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Frekuensi</label>
                    <input
                        type="text"
                        name="frekuensi"
                        value={formData.frekuensi}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none disabled:bg-blue-300"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <Link
                        to="/peralatan-cns"
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
                    >
                        Kembali
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default TambahAlatCNS;
