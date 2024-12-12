import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Data Dummy

const teknisiData = [
  { name: "ALLAN LENGKONG", category: "CNS" },
  { name: "ANDI NURFAJRIANA", category: "CNS" },
  { name: "BENEDITH KELVIN", category: "CNS" },
  { name: "BHIMA A. PUTRA", category: "Support" },
  { name: "DAVID KHARISMA. N", category: "Support" },
  { name: "DEIVI TUMIIR", category: "Supervisor" },
  { name: "EVAN H SIPAYUNG", category: "Support" },
  { name: "FADJAR RAMADHAN", category: "CNS" },
  { name: "GUNAWAN PRASETYO", category: "CNS" },
  { name: "JEFRI RANTE", category: "Support" }
];

function Teknisi() {
  const navigate = useNavigate();
  return (
    <div className="container w-screen max-w-[1370px] mx-auto p-4">
      {/* Header */}
      <div className="w-[1150px] mb-6">
        <h1 className="text-2xl font-bold mb-4 text-black">List Teknisi</h1>
        <button
         onClick={() => navigate('/tambah-teknisi')}
         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          <FontAwesomeIcon icon={faEdit} className="mr-2" /> Tambah Teknisi
        </button>
      </div>

      {/* Table Container */}
      <div className="w-[1150px] bg-white shadow-md rounded-lg p-4">
        <table className="min-w-full bg-white">
          {/* Table Header */}
          <thead>
            <tr className="text-black">
              <th className="py-2 px-4 border-b">Nama Teknisi</th>
              <th className="py-2 px-4 border-b">Kategori</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-black">
            {teknisiData.map((teknisi, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{teknisi.name}</td>
                <td className="py-2 px-4 border-b">{teknisi.category}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex space-x-2">
                    <button className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600 rounded flex items-center justify-center">
                      <FontAwesomeIcon icon={faEdit} className="text-white text-sm" />
                    </button>
                    <button className="w-[30px] h-[30px] bg-red-500 hover:bg-red-600 rounded flex items-center justify-center">
                      <FontAwesomeIcon icon={faTrash} className="text-white text-sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-black">
          <div>Showing 1 to 10 of {teknisiData.length} entries</div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50">Previous</button>
            <button className="px-3 py-1 border border-blue-300 rounded-md bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50">2</button>
            <button className="px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50">3</button>
            <button className="px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50">Next</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4">
        <p className="text-black">Air Nav Manado</p>
      </footer>
    </div>
  );
}

export default Teknisi;
