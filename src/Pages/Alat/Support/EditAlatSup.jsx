import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

function EditAlatSup() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get document ID from URL params
    const [formData, setFormData] = useState({
        namaAlat: '',
        kategoriAlat: 'Elektrikal',
        SNIndoor: '',
        SNOutdoor: '',
        status: 'Close',
        Tahun: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, 'PeralatanSupport', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setFormData(docSnap.data());
                } else {
                    console.error('No such document!');
                    setError('Document not found');
                }
            } catch (err) {
                console.error('Error fetching document:', err);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

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
            const docRef = doc(db, 'PeralatanSupport', id);
            await updateDoc(docRef, formData);
            navigate('/peralatan-sup'); // Navigate back to the equipment list
        } catch (error) {
            console.error('Error updating document:', error);
            setError('Failed to update data');
        }
    };

    if (loading) {
        return <div className="container mt-40">Loading...</div>;
    }

    if (error) {
        return <div className="container mt-40">Error: {error}</div>;
    }

    return (
        <div className="container mt-40 w-screen max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Edit Data Peralatan Support</h1>

            {/* Breadcrumb */}
            <div className="bg-gray-100 p-3 rounded-lg mb-6">
                <nav className="text-gray-600">
                    <span className="mx-2">/</span>
                    <Link to="/peralatan-sup" className="text-blue-500">List Peralatan Support</Link>
                    <span className="mx-2">/</span>
                    <span>Edit Peralatan Support</span>
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
                    <label className="block text-gray-700 mb-2">SN Outdoor</label>
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

export default EditAlatSup;
