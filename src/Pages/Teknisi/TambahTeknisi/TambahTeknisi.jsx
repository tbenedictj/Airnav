import React, { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

const AddTeknisi = () => {
  const navigate = useNavigate();
  const [technicianName, setTechnicianName] = useState("");
  const [category, setCategory] = useState("Supervisor");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ technicianName, category });
    alert(`Teknisi ${technicianName} dengan kategori ${category} berhasil disimpan.`);
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
            >
              <option value="Supervisor">Supervisor</option>
              <option value="Operator">CNS</option>
              <option value="Assistant">Support</option>
            </select>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-4">
          <button
            onClick={goBack}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Kembali
          </button>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeknisi;
