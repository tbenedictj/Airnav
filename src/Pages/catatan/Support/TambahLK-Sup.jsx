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
                const peralatanCollection = collection(db, "PeralatanSupport");
                const peralatanSnapshot = await getDocs(peralatanCollection);
                const peralatanList = peralatanSnapshot.docs.map(doc => doc.data().namaAlat);
                setPeralatanOptions(peralatanList);

                // Fetch Teknisi Support
                const teknisiCollection = collection(db, "teknisi");
                const teknisiSnapshot = await getDocs(teknisiCollection);
                
                const teknisiList = teknisiSnapshot.docs
                    .filter(doc => {
                        const data = doc.data();
                        return data.category?.toUpperCase() === 'SUPPORT';
                    })
                    .map(doc => {
                        const data = doc.data();
                        return data.name || data.nama;
                    })
                    .filter(name => name);
                
                setTeknisiOptions(teknisiList);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowTeknisiDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const handleTeknisiSelect = (teknisi) => {
        setFormData(prev => ({
            ...prev,
            teknisi: prev.teknisi.includes(teknisi)
                ? prev.teknisi.filter(t => t !== teknisi)
                : [...prev.teknisi, teknisi]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let buktiUrl = '';
            if (formData.bukti) {
                const storageRef = ref(storage, `bukti_support/${formData.bukti.name + Date.now()}`);
                const snapshot = await uploadBytes(storageRef, formData.bukti);
                buktiUrl = await getDownloadURL(snapshot.ref);
            }

            await addDoc(collection(db, "LaporanSupport"), {
                tanggal: formData.tanggal,
                jamSelesai: formData.jamSelesai,
                peralatan: formData.peralatan,
                aktivitas: formData.aktivitas,
                teknisi: formData.teknisi,
                status: formData.status,
                bukti: buktiUrl,
                createdAt: new Date(),
                userId: currentUser.uid
            });

            alert("Data berhasil ditambahkan!");
            navigate('/lk-sup');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Terjadi kesalahan saat menambahkan data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Tambah Laporan Kegiatan & Kerusakan Support</h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                {peralatanOptions.map((alat, index) => (
                                    <option key={index} value={alat}>{alat}</option>
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
                                className="mt-1 block w-full rounded-md border-[1px] border-black bg-white shadow-sm focus:border-black focus:ring-0"
                                required
                            />
                        </div>

                        <div className="relative" ref={dropdownRef}>
                            <label className="block text-sm font-medium text-gray-700">Teknisi</label>
                            <div className="mt-1">
                                <div
                                    className="min-h-[2.5rem] p-2 border-[1px] border-black rounded-md cursor-pointer flex flex-wrap gap-1"
                                    onClick={() => setShowTeknisiDropdown(!showTeknisiDropdown)}
                                >
                                    {formData.teknisi.length > 0 ? (
                                        formData.teknisi.map((teknisi, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                                            >
                                                {teknisi}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500">Pilih Teknisi</span>
                                    )}
                                </div>
                                {showTeknisiDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                        {teknisiOptions.map((teknisi, index) => (
                                            <div
                                                key={index}
                                                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                                    formData.teknisi.includes(teknisi) ? 'bg-blue-50' : ''
                                                }`}
                                                onClick={() => handleTeknisiSelect(teknisi)}
                                            >
                                                {teknisi}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
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
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mt-2 h-32 object-contain"
                                />
                            )}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Link
                                to="/lk-sup"
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Kembali
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-blue-300"
                            >
                                {loading ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TambahCatatan;
