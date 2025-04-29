import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { storage, db } from "../../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../../config/AuthContext";

const TambahCatatan = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
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
    const [loading, setLoading] = useState(false);
    const [showTeknisiDropdown, setShowTeknisiDropdown] = useState(false);
    const [showPeralatanDropdown, setShowPeralatanDropdown] = useState(false);
    const [teknisiOptions, setTeknisiOptions] = useState([]);
    const [peralatanOptions, setPeralatanOptions] = useState([]);
    const dropdownRef = useRef(null);
    const peralatanDropdownRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch technicians with category CNS
                const teknisiQuery = query(
                    collection(db, 'teknisi'),
                    where('category', '==', 'CNS')
                );
                const teknisiSnapshot = await getDocs(teknisiQuery);
                const teknisiData = teknisiSnapshot.docs.map(doc => doc.data().name);
                setTeknisiOptions(teknisiData);

                // Fetch equipment from PeralatanCNS collection
                const peralatanSnapshot = await getDocs(collection(db, 'PeralatanCNS'));
                const peralatanData = peralatanSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log('Peralatan Data:', peralatanData); // Debug log
                const peralatanNames = peralatanData.map(doc => doc.namaAlat || doc.name || '');
                setPeralatanOptions(peralatanNames.filter(name => name !== ''));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowTeknisiDropdown(false);
            }
            if (peralatanDropdownRef.current && !peralatanDropdownRef.current.contains(event.target)) {
                setShowPeralatanDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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
            ? [...prev.aktivitas, value] // Tambah aktivitas jika dicentang
            : prev.aktivitas.filter(item => item !== value) // Hapus aktivitas jika tidak dicentang
        }));
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

    const toggleDropdown = () => {
        setShowTeknisiDropdown(!showTeknisiDropdown);
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
                const buktiRef = ref(storage, `bukti${Date.now()}-${formData.bukti.name}`);
                await uploadBytes(buktiRef, formData.bukti);
                buktiUrl = await getDownloadURL(buktiRef);
            }

            const aktivitasFinal = [...formData.aktivitas];
                if (formData.Tx) aktivitasFinal.push(formData.Tx); // Tambahkan Tx
                if (formData.Rx) aktivitasFinal.push(formData.Rx); // Tambahkan Rx

                const aktivitasFormatted = aktivitasFinal.map(item => `- ${item}`).join('\n');
            // Save to Firestore
            await addDoc(collection(db, 'CH-CNS'), {
                ...formData,
                teknisi: formData.teknisi.join(', '),
                aktivitas: aktivitasFormatted,
                buktiUrl,
                userId: currentUser.uid,
                createdAt: new Date().toISOString()
            });

            navigate('/ch-cns');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Terjadi kesalahan saat menyimpan data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid flex-col sticky h-screen sticky max-w-4xl w-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-lg shadow p-6 sm:p-8">
                <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Tambah Catatan Harian</h1>

                <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
                    <nav className="text-gray-600">
                        <span className="mx-2">/</span>
                        <Link to="/ch-cns" className="text-blue-500">List Catatan Harian CNS</Link>
                        <span className="mx-2">/</span>
                        <span>Tambah Catatan Harian</span>
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

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700">Peralatan</label>
                            <div className="mt-1" ref={peralatanDropdownRef}>
                                <div 
                                    className="w-full min-h-[38px] rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 cursor-pointer"
                                    onClick={() => setShowPeralatanDropdown(!showPeralatanDropdown)}
                                >
                                    {formData.peralatan || <span className="text-gray-400">Pilih Peralatan</span>}
                                </div>

                                {showPeralatanDropdown && (
                                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                        <div className="p-2">
                                            {peralatanOptions.length > 0 ? (
                                                peralatanOptions.map((alat, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center px-2 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                peralatan: alat
                                                            }));
                                                            setShowPeralatanDropdown(false);
                                                        }}
                                                    >
                                                        <label className="block text-sm text-gray-700">
                                                            {alat}
                                                        </label>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-2 py-2 text-sm text-gray-500">
                                                    Tidak ada peralatan tersedia
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between pt-4 text-black">
                            <div className="mt-2">
                                <label className="block">
                                <input
                                    className="mr-2"
                                    type="checkbox"
                                    name="aktivitas"
                                    value="Pemeliharaan Harian"
                                    checked={formData.aktivitas.includes('Pemeliharaan Harian')}
                                    onChange={handleCheckboxChange}
                                />
                                Pemeliharaan Harian
                                </label>
                                <label className="block">
                                <input
                                    className="mr-2"
                                    type="checkbox"
                                    name="aktivitas"
                                    value="Memeriksa kondisi pengaturan suhu ruangan"
                                    checked={formData.aktivitas.includes('Memeriksa kondisi pengaturan suhu ruangan')}
                                    onChange={handleCheckboxChange}
                                />
                                Memeriksa kondisi pengaturan suhu ruangan
                                </label>
                                <label className="block">
                                <input
                                    className="mr-2"
                                    type="checkbox"
                                    name="aktivitas"
                                    value="Periksa seluruh lampu indikator"
                                    checked={formData.aktivitas.includes('Periksa seluruh lampu indikator')}
                                    onChange={handleCheckboxChange}
                                />
                                Periksa seluruh lampu indikator
                                </label>
                                <label className="block">
                                <input
                                    className="mr-2"
                                    type="checkbox"
                                    name="aktivitas"
                                    value="Membersihkan ruangan peralatan"
                                    checked={formData.aktivitas.includes('Membersihkan ruangan peralatan')}
                                    onChange={handleCheckboxChange}
                                />
                                Membersihkan ruangan peralatan
                                </label>
                                <label className="block">
                                <input
                                    className="mr-2"
                                    type="checkbox"
                                    name="aktivitas"
                                    value="Test On Load Battery"
                                    checked={formData.aktivitas.includes('Test On Load Battery')}
                                    onChange={handleCheckboxChange}
                                />
                                Test On Load Battery
                                </label>
                                <label className="block">
                                <input
                                    className="mr-2"
                                    type="checkbox"
                                    name="aktivitas"
                                    value="Peralatan Normal Operasi"
                                    checked={formData.aktivitas.includes('Peralatan Normal Operasi')}
                                    onChange={handleCheckboxChange}
                                />
                                Peralatan Normal Operasi
                                </label>
                            </div>
                        </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Status Peralatan Tx</label>
              <div className="mt-2">
                <label className="mr-4">
                  <input
                    className="mr-2"
                    name="Tx"
                    type="radio"
                    value="Tx 1 Main | Tx 2 Standby"
                    checked={formData.Tx === 'Tx 1 Main | Tx 2 Standby'}
                    onChange={handleRadioChange}
                  />
                  Tx 1
                </label>
                <label>
                  <input
                    className="mr-2"
                    name="Tx"
                    type="radio"
                    value="Tx 2 Main | Tx 1 Standby"
                    checked={formData.Tx === 'Tx 2 Main | Tx 1 Standby'}
                    onChange={handleRadioChange}
                  />
                  Tx 2
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Status Peralatan Rx</label>
              <div className="mt-2">
                <label className="mr-4">
                  <input
                    className="mr-2"
                    name="Rx"
                    type="radio"
                    value="Rx 1 Main | Rx 2 Standby"
                    checked={formData.Rx === 'Rx 1 Main | Rx 2 Standby'}
                    onChange={handleRadioChange}
                  />
                  Rx 1
                </label>
                <label>
                  <input
                    className="mr-2"
                    name="Rx"
                    type="radio"
                    value="Rx 2 Main | Rx 1 Standby"
                    checked={formData.Rx === 'Rx 2 Main | Rx 1 Standby'}
                    onChange={handleRadioChange}
                  />
                  Rx 2
                </label>
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
                                                className="inline-flex items-center bg-transparent text-black rounded px-2 py-1 text-sm"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {teknisi}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleTeknisiChange(teknisi);
                                                    }}
                                                    className="ml-1 text-gray-400 hover:text-gray-600 text-xs p-0 border border-gray-300 rounded"
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
                            <label className="block text-sm font-medium text-gray-700">Upload Bukti</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-1 block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover" />
                                    <button
                                        type="button"
                                        onClick={handleCancelImage}
                                        className="mt-2 text-red-600 hover:text-red-800"
                                    >
                                        Hapus Gambar
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