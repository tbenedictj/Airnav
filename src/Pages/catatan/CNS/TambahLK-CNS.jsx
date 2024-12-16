import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { storage, db } from "../../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useAuth } from "../../../config/AuthContext";

const TambahCatatan = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [peralatanOptions, setPeralatanOptions] = useState([]);
    const [teknisiOptions, setTeknisiOptions] = useState([]);
    const [formData, setFormData] = useState({
        tanggal: '',
        jamSelesai: '',
        peralatan: '',
        aktivitas: '',
        teknisi: [],
        status: 'open',
        bukti: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showTeknisiDropdown, setShowTeknisiDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Peralatan
                const peralatanCollection = collection(db, "PeralatanCNS");
                const peralatanSnapshot = await getDocs(peralatanCollection);
                const peralatanList = peralatanSnapshot.docs.map(doc => doc.data().namaAlat);
                setPeralatanOptions(peralatanList);

                // Fetch Teknisi CNS
                const teknisiCollection = collection(db, "teknisi");
                const teknisiSnapshot = await getDocs(teknisiCollection);
                
                const teknisiList = teknisiSnapshot.docs
                    .filter(doc => {
                        const data = doc.data();
                        // Check for both 'CNS' and 'cns' in category
                        return data.category?.toUpperCase() === 'CNS';
                    })
                    .map(doc => {
                        const data = doc.data();
                        return data.name || data.nama; // Try both name fields
                    })
                    .filter(name => name); // Remove any undefined values
                
                console.log("Final teknisi list:", teknisiList);
                setTeknisiOptions(teknisiList);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowTeknisiDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'teknisi') {
            // Handle multiple select
            const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
            setFormData(prev => ({
                ...prev,
                [name]: selectedOptions
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleTeknisiChange = (selectedTeknisi) => {
        setFormData(prev => {
            const updatedTeknisi = prev.teknisi.includes(selectedTeknisi)
                ? prev.teknisi.filter(t => t !== selectedTeknisi)
                : [...prev.teknisi, selectedTeknisi];
            return {
                ...prev,
                teknisi: updatedTeknisi
            };
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.teknisi.length === 0) {
            alert('Pilih minimal satu teknisi');
            return;
        }
        setLoading(true);

        try {
            let buktiUrl = '';

            // Upload image if exists
            if (formData.bukti) {
                const buktiRef = ref(storage, `bukti/${Date.now()}-${formData.bukti.name}`);
                await uploadBytes(buktiRef, formData.bukti);
                buktiUrl = await getDownloadURL(buktiRef);
            }

            // Save to Firestore
            await addDoc(collection(db, 'LaporanCNS'), {
                ...formData,
                teknisi: formData.teknisi.join(', '), // Join array into comma-separated string
                buktiUrl,
                userId: currentUser.uid,
                createdAt: new Date().toISOString()
            });

            navigate('/lk-cns');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Terjadi kesalahan saat menyimpan data');
        } finally {
            setLoading(false);
        }
    };

    const toggleDropdown = () => {
        setShowTeknisiDropdown(!showTeknisiDropdown);
    };

    return (
    <div className="container shadow w-screen max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-96">
        <div className="bg-white rounded-lg shadow p-6 sm:p-8">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Tambah Laporan Kegiatan & Kerusakan Baru</h1>

            <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
                <nav className="text-gray-600">
                    <span className="mx-2">/</span>
                    <Link to="/lk-cns" className="text-blue-500">List Laporan Kegiatan & Kerusakan CNS</Link>
                    <span className="mx-2">/</span>
                    <span>Tambah Laporan Kegiatan & Kerusakan</span>
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
                        <select
                            name="peralatan"
                            value={formData.peralatan}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-[1px] border-black bg-white shadow-sm focus:border-black focus:ring-0"
                            required
                        >
                            <option value="">Pilih Peralatan</option>
                            {peralatanOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
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

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Teknisi</label>
                        <div className="mt-1" ref={dropdownRef}>
                            <div 
                                className="w-full min-h-[38px] rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 cursor-pointer"
                                onClick={toggleDropdown}
                            >
                                <div className="flex flex-wrap gap-1">
                                    {formData.teknisi.map((teknisi, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center bg-gray-100 rounded px-2 py-1 text-sm"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {teknisi}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTeknisiChange(teknisi);
                                                }}
                                                className="ml-1 text-gray-400 hover:text-gray-600"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                    <span 
                                        className="flex-grow min-w-[60px] p-1 text-sm text-gray-400"
                                        onClick={toggleDropdown}
                                    >
                                        {formData.teknisi.length === 0 ? "Pilih Teknisi" : ""}
                                    </span>
                                </div>
                            </div>

                            {showTeknisiDropdown && (
                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                    <div className="p-2">
                                        {teknisiOptions.map((teknisi, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center px-2 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTeknisiChange(teknisi);
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    checked={formData.teknisi.includes(teknisi)}
                                                    onChange={() => {}}
                                                />
                                                <label className="ml-3 block text-sm text-gray-700">
                                                    {teknisi}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-[1px] border-black bg-white shadow-sm focus:border-black focus:ring-0"
                            required
                        >
                            <option value="open">Open</option>
                            <option value="close">Close</option>
                        </select>
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
