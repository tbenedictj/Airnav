import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { storage, db } from "../../../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../../../config/AuthContext";

const EditLKSup = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { id } = useParams(); // ID catatan yang akan diedit
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

                // Fetch existing Catatan data
                const docRef = doc(db, "LaporanSupport", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        tanggal: data.tanggal,
                        jamSelesai: data.jamSelesai,
                        peralatan: data.peralatan,
                        aktivitas: data.aktivitas,
                        teknisi: data.teknisi || [],
                        status: data.status,
                        bukti: data.bukti || null
                    });

                    if (data.bukti) {
                        setImagePreview(data.bukti); // Tampilkan gambar jika ada
                    }
                } else {
                    console.log("Catatan tidak ditemukan!");
                    alert("Catatan tidak ditemukan");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [id]);

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
            let buktiUrl = formData.bukti;
            if (formData.bukti && typeof formData.bukti !== 'string') {
                const storageRef = ref(storage, `bukti_support/${formData.bukti.name + Date.now()}`);
                const snapshot = await uploadBytes(storageRef, formData.bukti);
                buktiUrl = await getDownloadURL(snapshot.ref);
            }

            const docRef = doc(db, "LaporanSupport", id);
            await updateDoc(docRef, {
                tanggal: formData.tanggal,
                jamSelesai: formData.jamSelesai,
                peralatan: formData.peralatan,
                aktivitas: formData.aktivitas,
                teknisi: formData.teknisi,
                status: formData.status,
                bukti: buktiUrl,
                updatedAt: new Date(),
                userId: currentUser.uid
            });

            alert("Data berhasil diperbarui!");
            navigate('/lk-sup');
        } catch (error) {
            console.error("Error updating document: ", error);
            alert("Terjadi kesalahan saat memperbarui data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid flex-col w-screen max-w-4xl sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-lg shadow p-6 sm:p-8">
                <h1 className="text-2xl font-bold mb-4 text-center sm:text-lef">Edit Laporan Kegiatan & Kerusakan Support</h1>
                    <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
                          <nav className="text-gray-600">
                            <span className="mx-2">/</span>
                            <Link to="/lk-sup" className="text-blue-500">List Laporan Kegiatan & Kerusakan Support</Link>
                            <span className="mx-2">/</span>
                            <span>Edit Laporan Kegiatan & Kerusakan</span>
                          </nav>
                    </div>
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

export default EditLKSup;
