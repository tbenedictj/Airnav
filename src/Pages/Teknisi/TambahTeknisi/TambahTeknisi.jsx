import React, { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../../../src/config/firebase';

const AddTeknisi = () => {
  const navigate = useNavigate();
  const [technicianName, setTechnicianName] = useState("");
  const [category, setCategory] = useState("Supervisor");
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="container mr-40 w-screen justify-center items-center flex mx-auto p-4">
      <div className="bg-white shadow-md max-w-4xl rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl md:text-3xl mr-40 font-bold mb-4 text-black text-center">
            Tambah Data Teknisi
          </h1>
          <div className="text-sm text-gray-500 mb-6">
            Teknisi / <span className="text-blue-600">List Teknisi</span> / Add Teknisi
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Supervisor">Supervisor</option>
              <option value="CNS">CNS</option>
              <option value="Support">Support</option>
            </select>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={goBack}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              disabled={isLoading}
            >
              Kembali
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeknisi;