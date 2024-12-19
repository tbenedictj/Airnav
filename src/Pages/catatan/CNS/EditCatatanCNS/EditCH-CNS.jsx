import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../../config/firebase';
import '@fortawesome/fontawesome-free/css/all.min.css';

const EditCHCNS = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // State for form fields
    const [formData, setFormData] = useState({
        tanggal: '',
        jamMulai: '',
        jamSelesai: '',
        peralatan: '',
        aktivitas: '',
        teknisi: '',
        note: '',
        bukti: null
    });

    // State for image upload
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, 'CH-CNS', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        tanggal: data.tanggal || '',
                        jamMulai: data.jamMulai || '',
                        jamSelesai: data.jamSelesai || '',
                        peralatan: data.peralatan || '',
                        aktivitas: data.aktivitas || '',
                        teknisi: data.teknisi || '',
                        note: data.note || '',
                        bukti: data.bukti || null
                    });
                    setImagePreview(data.bukti || null);
                } else {
                    alert('Data tidak ditemukan');
                    navigate('/catatan-harian');
                }
            } catch (error) {
                console.error('Error fetching document:', error);
                alert('Terjadi kesalahan saat mengambil data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return formData.bukti;

        try {
            const storageRef = ref(storage, `CH-CNS-Bukti/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Gagal mengunggah gambar');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.tanggal || !formData.jamSelesai || !formData.peralatan || !formData.aktivitas || !formData.teknisi) {
            alert('Harap isi semua field yang wajib');
            return;
        }

        try {
            setLoading(true);
            const imageUrl = await uploadImage();

            const updatedData = {
                ...formData,
                bukti: imageUrl,
                updatedAt: new Date()
            };

            // Update document in Firestore
            const docRef = doc(db, 'CH-CNS', id);
            await updateDoc(docRef, updatedData);

            alert('Data berhasil diperbarui');
            navigate('/catatan-harian');
        } catch (error) {
            console.error('Error updating document:', error);
            alert('Terjadi kesalahan saat memperbarui data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="container-fluid flex-col sticky h-screen sticky max-w-4xl w-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold mb-6 text-left">Edit Catatan Harian CNS</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Tanggal *</label>
                    <input
                        type="date"
                        name="tanggal"
                        value={formData.tanggal}
                        onChange={handleInputChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>
                
                <div className="flex mb-4 space-x-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Jam Mulai</label>
                        <input
                            type="time"
                            name="jamMulai"
                            value={formData.jamMulai}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Jam Selesai *</label>
                        <input
                            type="time"
                            name="jamSelesai"
                            value={formData.jamSelesai}
                            onChange={handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Peralatan *</label>
                    <input
                        type="text"
                        name="peralatan"
                        value={formData.peralatan}
                        onChange={handleInputChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        placeholder="Masukkan nama peralatan"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Aktivitas *</label>
                    <textarea
                        name="aktivitas"
                        value={formData.aktivitas}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        placeholder="Jelaskan aktivitas yang dilakukan"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Teknisi *</label>
                    <input
                        type="text"
                        name="teknisi"
                        value={formData.teknisi}
                        onChange={handleInputChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        placeholder="Nama teknisi"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Catatan</label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        rows={3}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        placeholder="Tambahkan catatan tambahan (opsional)"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Bukti/Paraf</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    />
                    {imagePreview && (
                        <div className="mt-4">
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="max-w-full h-48 object-contain"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/catatan-harian')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Batalkan
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCHCNS;
