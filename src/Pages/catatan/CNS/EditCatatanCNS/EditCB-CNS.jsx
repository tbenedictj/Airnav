import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { storage, db } from "../../../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../../../config/AuthContext";

const EditCBCNS = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { id } = useParams();
  const [peralatanOptions, setPeralatanOptions] = useState([]);
  const [teknisiOptions, setTeknisiOptions] = useState([]);
  const [formData, setFormData] = useState({
    tanggal: '',
    jamMulai: '',
    jamSelesai: '',
    peralatan: '',
    aktivitas: [],
    teknisi: [],
    status: 'open',
    bukti: null,
    buktiUrl: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTeknisiDropdown, setShowTeknisiDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTeknisiDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Peralatan CNS data
        const peralatanSnapshot = await getDocs(collection(db, "PeralatanCNS"));
        const peralatanList = peralatanSnapshot.docs.map(doc => doc.data().namaAlat);
        setPeralatanOptions(peralatanList);

        // Fetch Teknisi data
        const teknisiSnapshot = await getDocs(collection(db, "teknisi"));
        const teknisiList = teknisiSnapshot.docs
          .filter(doc => doc.data().category?.toUpperCase() === 'CNS')
          .map(doc => doc.data().name || doc.data().nama);
        setTeknisiOptions(teknisiList);

        // Fetch existing CB data if editing
        if (id) {
          const docRef = doc(db, "CB-CNS", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              tanggal: data.tanggal || '',
              jamMulai: data.jamMulai || '',
              jamSelesai: data.jamSelesai || '',
              peralatan: data.peralatan || '',
              aktivitas: typeof data.aktivitas === 'string' ? 
                data.aktivitas.split('\n').map(item => item.replace(/^- /, '')) : 
                data.aktivitas || [],
              teknisi: Array.isArray(data.teknisi) ? data.teknisi : 
                data.teknisi ? [data.teknisi] : [],
              status: data.status || 'open',
              bukti: null,
              buktiUrl: data.buktiUrl || ''
            });

            if (data.buktiUrl) {
              setImagePreview(data.buktiUrl);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let buktiUrl = formData.buktiUrl;

      if (formData.bukti instanceof File) {
        const buktiRef = ref(storage, `bukti/${Date.now()}-${formData.bukti.name}`);
        await uploadBytes(buktiRef, formData.bukti);
        buktiUrl = await getDownloadURL(buktiRef);
      }

      const docRef = doc(db, "CB-CNS", id);
      await updateDoc(docRef, {
        ...formData,
        buktiUrl,
        bukti: null
      });

      navigate("/cb-cns");
    } catch (error) {
      console.error("Error updating document:", error);
      setError("Failed to update data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="container-fluid flex-col w-screen max-w-4xl sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-lg shadow p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Edit Catatan Bulanan CNS</h1>

        <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
          <nav className="text-gray-600">
            <span className="mx-2">/</span>
            <Link to="/cb-cns" className="text-blue-500">List Catatan Bulanan CNS</Link>
            <span className="mx-2">/</span>
            <span>Edit Catatan Bulanan</span>
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
              <label className="block text-sm font-medium text-gray-700">Jam Mulai</label>
              <input
                type="time"
                name="jamMulai"
                value={formData.jamMulai}
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
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Teknisi Section */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700">Teknisi</label>
              <div
                className="mt-1 block w-full rounded-md border-[1px] border-black bg-white shadow-sm focus:border-black focus:ring-0 p-2 cursor-pointer"
                onClick={() => setShowTeknisiDropdown(!showTeknisiDropdown)}
              >
                {formData.teknisi.length > 0
                  ? formData.teknisi.join(", ")
                  : "Pilih Teknisi"}
              </div>
              <div ref={dropdownRef}>
                {showTeknisiDropdown && (
                  <div className="absolute z-10 w-full bg-white border-[1px] border-black rounded mt-1 max-h-60 overflow-y-auto">
                    {teknisiOptions.map((teknisi, index) => (
                      <div
                        key={index}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${
                          formData.teknisi.includes(teknisi) ? "bg-gray-100" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTeknisiChange(teknisi);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.teknisi.includes(teknisi)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleTeknisiChange(teknisi);
                          }}
                          className="mr-2"
                        />
                        {teknisi}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Aktivitas</label>
              <textarea
                name="aktivitas"
                value={formData.aktivitas.join('\n')}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    aktivitas: value.split('\n').filter(item => item.trim() !== '')
                  }));
                }}
                className="mt-1 block w-full rounded-md border-[1px] border-black bg-white shadow-sm focus:border-black focus:ring-0"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bukti</label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="mt-1 block w-full"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="max-w-xs" />
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Link
                to="/cb-cns"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Kembali
              </Link>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCBCNS;
