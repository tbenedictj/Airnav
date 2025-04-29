import React, { useState, useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../config/firebase';

const EditTeknisi = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Supervisor');
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch technician data from Firestore when component mounts
  useEffect(() => {
    const fetchTechnician = async () => {
        console.log("Fetching technician with ID:", id);
        try {
            const docRef = doc(db, 'teknisi', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setName(docSnap.data().name);
                setCategory(docSnap.data().category);
            }else {
            setError("Teknisi tidak ditemukan.");
            }
        } catch (error) {
            console.error("Error fetching technician:", error);
            setError("Gagal memuat data teknisi.");
        }
    };
    fetchTechnician();
  }, [id]);

  // Handle form submission for updating the technician
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!auth.currentUser) {
      alert("Anda harus login terlebih dahulu!");
      navigate('/loginform');
      return;
    }

    try {
      const docRef = doc(db, "teknisi", id);
      await updateDoc(docRef, {
        name,
        category,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser.uid,
      });

      alert(`Teknisi ${name} berhasil diperbarui.`);
      navigate('/teknisi');  // Redirect to technician list page
    } catch (error) {
      console.error("Error updating technician:", error);
      alert("Gagal memperbarui data teknisi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to the previous page
  const goBack = () => {
    navigate(-1);
  };

  if (error) {
    return (
      <div className="container-fluid mx-auto w-screen max-w-4xl p-4">
        <div className="bg-red-100 p-4 rounded-md shadow-md">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mx-auto w-screen max-w-4xl p-4">
      <div className="bg-white shadow-md max-w-4xl rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">
            Edit Data Teknisi
          </h1>

          <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
            <nav className="text-gray-600">
              <span className="mx-2">/</span>
              <Link to="/teknisi" className="text-blue-500">List Teknisi</Link>
              <span className="mx-2">/</span>
              <span>Edit Teknisi</span>
            </nav>
          </div>

          {/* Nama Teknisi */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Teknisi
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama teknisi"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
              required
            />
          </div>

          {/* Kategori Teknisi */}
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Kategori Teknisi
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-black"
              required
            >
              <option value="Supervisor">Supervisor</option>
              <option value="CNS">CNS</option>
              <option value="Support">Support</option>
              <option value="Manager Teknik">Manager Teknik</option>
            </select>
          </div>

          {/* Tombol Aksi */}
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

export default EditTeknisi;
