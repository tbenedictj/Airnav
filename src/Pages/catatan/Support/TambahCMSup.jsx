import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { storage, db } from "../../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../../config/AuthContext";
import Tandatangan from "../../../Component/Signature/Tandatangan";

const TambahCatatan = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [peralatanOptions, setPeralatanOptions] = useState([]);
    const [teknisiOptions, setTeknisiOptions] = useState([]);
    const [formData, setFormData] = useState({
        tanggal: '',
        jamSelesai: '',
        peralatan: '',
        aktivitas: [],
        Tx: '',
        Rx: '',
        teknisi: [],
        note: '',
        bukti: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [signatureData, setSignatureData] = useState(null);
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

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            aktivitas: checked
            ? [...prev.aktivitas, value] 
            : prev.aktivitas.filter(item => item !== value)
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
        setFormData(prev => ({
            ...prev,
            bukti: null
        }));
        setImagePreview(null);
        // Reset the file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSignatureChange = (data) => {
        setSignatureData(data);
        setFormData(prev => ({
            ...prev,
            signature: data
        }));
    };

    const handleTeknisiSelect = (event) => {
        const { value } = event.target;
        setFormData(prev => ({
            ...prev,
            teknisi: prev.teknisi.includes(value)
                ? prev.teknisi.filter(t => t !== value)
                : [...prev.teknisi, value]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let buktiUrl = '';
            let signatureUrl = '';

            // Upload image if exists
            if (formData.bukti) {
                const buktiRef = ref(storage, `bukti_support/${Date.now()}-${formData.bukti.name}`);
                await uploadBytes(buktiRef, formData.bukti);
                buktiUrl = await getDownloadURL(buktiRef);
            }

            // Upload signature if exists
            if (signatureData) {
                const signatureBlob = await (await fetch(signatureData)).blob();
                const signatureRef = ref(storage, `signatures/${Date.now()}-signature.png`);
                await uploadBytes(signatureRef, signatureBlob);
                signatureUrl = await getDownloadURL(signatureRef);
            }

            const aktivitasFinal = [...formData.aktivitas];
            if (formData.Tx) aktivitasFinal.push(formData.Tx); // Tambahkan Tx
            if (formData.Rx) aktivitasFinal.push(formData.Rx); // Tambahkan Rx

            const aktivitasFormatted = aktivitasFinal.map(item => `- ${item}`).join('\n');

            await addDoc(collection(db, "CM-Sup"), {
                tanggal: formData.tanggal,
                jamSelesai: formData.jamSelesai,
                peralatan: formData.peralatan,
                Tx: formData.Tx,
                Rx: formData.Rx,
                aktivitas: aktivitasFormatted,
                teknisi: formData.teknisi.join(', '),
                bukti: buktiUrl,
                note: formData.note,
                approve: false,
                createdAt: serverTimestamp(),
                userId: currentUser.uid
            });

            alert("Data berhasil ditambahkan!");
            navigate('/cm-sup');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Terjadi kesalahan saat menambahkan data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid flex-col max-w-4xl w-screen h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-lg shadow p-6 sm:p-8">
                <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Tambah Catatan Mingguan</h1>

                <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
                    <nav className="text-gray-600">
                        <span className="mx-2">/</span>
                        <Link to="/ch-sup" className="text-blue-500">List Catatan Mingguan Support</Link>
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

                        <div className="flex flex-col sm:flex-row justify-between pt-4 text-black">
                            <div className="mt-2">
                                {[
                                    "Pemeliharaan Mingguan",
                                    "Memeriksa kondisi pengaturan suhu ruangan",
                                    "Periksa seluruh lampu indikator",
                                    "Membersihkan ruangan peralatan",
                                    "Test On Load Battery",
                                    "Peralatan Normal Operasi"
                                ].map((activity, idx) => (
                                    <label key={idx} className="block">
                                        <input
                                            className="mr-2"
                                            type="checkbox"
                                            name="aktivitas"
                                            value={activity}
                                            checked={formData.aktivitas.includes(activity)}
                                            onChange={handleCheckboxChange}
                                        />
                                        {activity}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Status Peralatan Tx</label>
                            <div className="mt-2">
                                {[
                                    { value: "Tx 1 Main | Tx 2 Standby", label: "Tx 1" },
                                    { value: "Tx 2 Main | Tx 1 Standby", label: "Tx 2" }
                                ].map((option, idx) => (
                                    <label key={idx} className={idx === 0 ? "mr-4" : ""}>
                                        <input
                                            className="mr-2"
                                            name="Tx"
                                            type="radio"
                                            value={option.value}
                                            checked={formData.Tx === option.value}
                                            onChange={handleRadioChange}
                                        />
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Status Peralatan Rx</label>
                            <div className="mt-2">
                                {[
                                    { value: "Rx 1 Main | Rx 2 Standby", label: "Rx 1" },
                                    { value: "Rx 2 Main | Rx 1 Standby", label: "Rx 2" }
                                ].map((option, idx) => (
                                    <label key={idx} className={idx === 0 ? "mr-4" : ""}>
                                        <input
                                            className="mr-2"
                                            name="Rx"
                                            type="radio"
                                            value={option.value}
                                            checked={formData.Rx === option.value}
                                            onChange={handleRadioChange}
                                        />
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Catatan</label>
                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleInputChange}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-[1px] border-black bg-white shadow-sm focus:border-black focus:ring-0"
                            />
                        </div>

                        <div className="relative" ref={dropdownRef}>
                            <label className="block text-sm font-medium text-gray-700">Teknisi</label>
                            <button
                                type="button"
                                onClick={() => setShowTeknisiDropdown(!showTeknisiDropdown)}
                                className="mt-1 block w-full rounded-md border-[1px] text-sm text-gray-400 border-gray-300 bg-white shadow-sm text-left p-2"
                            >
                                {formData.teknisi.length > 0 ? formData.teknisi.join(", ") : "Pilih Teknisi"}
                            </button>

                            {showTeknisiDropdown && (
                                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                                    {teknisiOptions.map((teknisi, index) => (
                                        <label key={index} className="block p-2 hover:bg-gray-100 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="teknisi"
                                                value={teknisi}
                                                checked={formData.teknisi.includes(teknisi)}
                                                onChange={handleTeknisiSelect}
                                                className="mr-2"
                                            />
                                            {teknisi}
                                        </label>
                                    ))}
                                </div>
                            )}
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