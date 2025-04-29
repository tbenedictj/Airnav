import React, { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../../../src/config/firebase';

const AddTeknisi = () => {
  const navigate = useNavigate();
  const [technicianName, setTechnicianName] = useState("");
  const [category, setCategory] = useState("Supervisor");
  const [loading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!auth.currentUser) {
      alert("Anda harus login terlebih dahulu!");
      navigate('/loginform');
      return;
    }

    try {
      // Add document to Firestore
      const docRef = await addDoc(collection(db, "teknisi"), {
        name: technicianName,
        category: category,
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser.uid
      });

      console.log("Document written with ID: ", docRef.id);
      alert(`Teknisi ${technicianName} berhasil ditambahkan ke database.`);
      navigate('/teknisi'); // Redirect back to technician list
    } catch (error) {
      console.error("Error detail:", error);
      alert(`Terjadi kesalahan saat menyimpan data teknisi: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container-fluid mx-auto w-screen max-w-4xl p-4">
      <div className="bg-white shadow-md max-w-4xl rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">
            Tambah Data Teknisi
          </h1>

          <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
            <nav className="text-gray-600">
                <span className="mx-2">/</span>
                  <Link to="/teknisi" className="text-blue-500">List Teknisi</Link>
                  <span className="mx-2">/</span>
                  <span>Tambah Teknisi</span>
            </nav>
          </div>

          {/* Nama Teknisi */}
          <div className="mb-4">
            <label htmlFor="technicianName" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Teknisi
            </label>
            <input
              type="text"
              id="technicianName"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-black "
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

export default AddTeknisi;