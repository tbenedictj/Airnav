import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { storage, db } from "../../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../../../config/AuthContext";
import Tandatangan from "../../../Component/Signature/Tandatangan";

const TambahCatatan = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        tanggal: '',
        jamSelesai: '',
        peralatan: '',
        aktivitas: '',
        teknisi: '',
        bukti: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [signatureData, setSignatureData] = useState(null);
    const [loading, setLoading] = useState(false);

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
            setFormData(prev => ({
                ...prev,
                bukti: file
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancelImage = () => {
        setImagePreview(null);
        setFormData(prev => ({
            ...prev,
            bukti: null
        }));
        // Reset the file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSignatureChange = (data) => {
        setSignatureData(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!signatureData) {
            alert('Tanda tangan diperlukan');
            return;
        }
        setLoading(true);

        try {
            let buktiUrl = '';
            let signatureUrl = '';

            // Upload image if exists
            if (formData.bukti) {
                const buktiRef = ref(storage, `bukti/${Date.now()}-${formData.bukti.name}`);
                await uploadBytes(buktiRef, formData.bukti);
                buktiUrl = await getDownloadURL(buktiRef);
            }

            // Upload signature
            const signatureBlob = await (await fetch(signatureData)).blob();
            const signatureRef = ref(storage, `signatures/${Date.now()}-signature.png`);
            await uploadBytes(signatureRef, signatureBlob);
            signatureUrl = await getDownloadURL(signatureRef);

            // Save to Firestore
            await addDoc(collection(db, 'catatan'), {
                ...formData,
                buktiUrl,
                signatureUrl,
                userId: currentUser.uid,
                createdAt: new Date().toISOString()
            });

            navigate(-1); // Go back to previous page
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Terjadi kesalahan saat menyimpan data');
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="container shadow w-screen max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-96">
        <div className="bg-white rounded-lg shadow p-6 sm:p-8">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Tambah Catatan Mingguan</h1>

            <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
                <nav className="text-gray-600">
                    <span className="mx-2">/</span>
                    <Link to="/cm-sup" className="text-blue-500">List Catatan Mingguan Support</Link>
                    <span className="mx-2">/</span>
                    <span>Tambah Catatan Mingguan</span>
                </nav>
            </div>
            <form onSubmit={handleSubmit} className="shadow space-y-6">
                <div className="shadow space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                        <input
                            type="date"
                            name="tanggal"
                            value={formData.tanggal}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-[1px] border-black bg-white shadow-sm focus:border-black focus:ring-0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Jam Selesai</label>
                        <input
                            type="time"
                            name="jamSelesai"
                            value={formData.jamSelesai}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-[1px] border-black bg-white shadow-sm focus:border-black focus:ring-0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Peralatan</label>
                        <input
                            type="text"
                            name="peralatan"
                            value={formData.peralatan}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-[1px] border-black bg-white shadow-sm focus:border-black focus:ring-0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Aktivitas</label>
                        <textarea
                            name="aktivitas"
                            value={formData.aktivitas}
                            onChange={handleInputChange}
                            rows={4}
                            className= "mt-1 block w-full rounded-md border-[1px] border-black bg-white shadow-sm focus:border-black focus:ring-0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Teknisi</label>
                        <input
                            type="text"
                            name="teknisi"
                            value={formData.teknisi}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-[1px] border-black bg-white shadow-sm focus:border-black focus:ring-0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Bukti</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full"
                        />
                        {imagePreview && (
                            <div className="relative mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-40 object-contain"
                                />
                                <button
                                    type="button"
                                    onClick={handleCancelImage}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transform translate-x-1/2 -translate-y-1/2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Signature Component */}
                    <div className="mb-4">
                        <Tandatangan onSignatureChange={handleSignatureChange} />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mb-2 sm:mb-0"
                        disabled={loading}
                    >
                        Kembali
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </form>
        </div>
    </div>
    );
};

export default TambahCatatan;
