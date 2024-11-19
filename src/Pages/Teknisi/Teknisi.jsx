import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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
  return (
    <div className="container">
      <div className="table-container">
        <h1 className="text-2xl font-bold mb-4">List Teknisi</h1>
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold text-blue-600">Teknisi</div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              <FontAwesomeIcon icon={faEdit} className="mr-2" />Tambah Teknisi
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Nama Teknisi</th>
                <th>Kategori</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teknisiData.map((teknisi, index) => (
                <tr key={index}>
                  <td>{teknisi.name}</td>
                  <td>{teknisi.category}</td>
                  <td>
                    <button className="bg-green-500 text-white px-2 py-1 rounded-lg mr-2">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded-lg">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <div>Showing 1 to 10 of 27 entries</div>
            <div className="flex items-center">
              <button className="px-3 py-1 border rounded-l-lg">Previous</button>
              <button className="px-3 py-1 border-t border-b">1</button>
              <button className="px-3 py-1 border-t border-b">2</button>
              <button className="px-3 py-1 border-t border-b">3</button>
              <button className="px-3 py-1 border rounded-r-lg">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Teknisi;
