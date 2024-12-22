import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { storage, db } from "../../../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, getDocs, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../../../config/AuthContext";

const EditLKSup = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { id } = useParams();
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
    status: 'open',
    bukti: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTeknisiDropdown, setShowTeknisiDropdown] = useState(false);
  const [statusTx, setStatusTx] = useState('Tx 1'); // Initialize state for Tx
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
          .filter(doc => doc.data().category?.toUpperCase() === 'SUPPORT')
          .map(doc => doc.data().name || doc.data().nama);
        setTeknisiOptions(teknisiList);

        // Fetch existing Laporan data to edit
        const laporanDoc = await getDoc(doc(db, "LaporanSupport", id));
        if (laporanDoc.exists()) {
          const data = laporanDoc.data();
          setFormData({
            tanggal: data.tanggal,
            jamSelesai: data.jamSelesai,
            peralatan: data.peralatan,
            aktivitas: data.aktivitas.split("\n"), // Convert string to array
            Tx: data.Tx,
            Rx: data.Rx,
            teknisi: data.teknisi,
            status: data.status,
            bukti: null
          });
          if (data.buktiUrl) {
            setImagePreview(data.buktiUrl);
          }
          setStatusTx(data.Tx); // Set initial Tx value
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeknisiChange = (teknisi) => {
    setFormData(prev => ({
      ...prev,
      teknisi: prev.teknisi.includes(teknisi)
        ? prev.teknisi.filter(item => item !== teknisi)
        : [...prev.teknisi, teknisi]
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

  const handleTxChange = (event) => {
    setStatusTx(event.target.value); // Update state when radio button changes
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
    setLoading(true);

    try {
      let buktiUrl = formData.buktiUrl || '';

      if (formData.bukti) {
        const buktiRef = ref(storage, `bukti/${Date.now()}-${formData.bukti.name}`);
        await uploadBytes(buktiRef, formData.bukti);
        buktiUrl = await getDownloadURL(buktiRef);
      }

      const aktivitasFinal = [...formData.aktivitas];
      if (formData.Tx) aktivitasFinal.push(formData.Tx); // Add Tx if exists
      if (formData.Rx) aktivitasFinal.push(formData.Rx); // Add Rx if exists

      const aktivitasFormatted = aktivitasFinal.map(item => `- ${item}`).join('\n');

      const dataToSave = {
        ...formData,
        Tx: statusTx, // Include the Tx value
        aktivitas: aktivitasFormatted,
        buktiUrl,
        userId: currentUser.uid,
        updatedAt: new Date().toISOString(),
      };

      // Update the Laporan data in Firestore
      const laporanRef = doc(db, "LaporanSupport", id);
      await updateDoc(laporanRef, dataToSave);

      navigate(-1); // Go back to previous page
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setShowTeknisiDropdown(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTeknisiDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="container-fluid flex-col w-screen max-w-4xl sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-lg shadow p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Edit Laporan Kegiatan & Kerusakan Support</h1>

        <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
          <nav className="text-gray-600">
            <span className="mx-2">/</span>
            <Link to="/lk-sup" className="text-blue-500">List Laporan Kegiatan & Kerusakan Support</Link>
            <span className="mx-2">/</span>
            <span>Edit Laporan Kegiatan & Kerusakan</span>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="shadow space-y-6">
          <div className="shadow space-y-4">
            {/* Form fields here (Tanggal, Jam Selesai, etc.) */}
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Pilih Peralatan</option>
                {peralatanOptions.length > 0 ? (
                  peralatanOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Loading peralatan...</option>
                )}
              </select>
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

            {/* Status Peralatan Tx (Radio) */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Status Peralatan Tx</label>
              <div className="mt-2">
                <label className="mr-4">
                  <input
                    className="mr-2"
                    type="radio"
                    value="Tx 1"
                    checked={statusTx === 'Tx 1'}
                    onChange={handleTxChange}
                  />
                  Tx 1
                </label>
                <label>
                  <input
                    className="mr-2"
                    type="radio"
                    value="Tx 2"
                    checked={statusTx === 'Tx 2'}
                    onChange={handleTxChange}
                  />
                  Tx 2
                </label>
              </div>
            </div>

            {/* Status Peralatan Rx (Radio) */}
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
              <label className="block text-sm font-medium text-gray-700">Teknisi</label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  onClick={toggleDropdown}
                >
                  {formData.teknisi.length > 0 ? formData.teknisi.join(', ') : 'Pilih Teknisi'}
                </button>
                {showTeknisiDropdown && (
                  <div className="absolute z-10 mt-2 w-full rounded-md bg-white shadow-lg">
                    {teknisiOptions.length > 0 ? (
                      teknisiOptions.map((option, index) => (
                        <div key={index} className="px-4 py-2 hover:bg-gray-100">
                          <label className="block">
                            <input
                              className="mr-2"
                              type="checkbox"
                              name="teknisi"
                              value={option}
                              checked={formData.teknisi.includes(option)}
                              onChange={() => handleTeknisiChange(option)}
                            />
                            {option}
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2">Loading teknisi...</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload section */}
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

            {/* Status */}
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

export default EditLKSup;
