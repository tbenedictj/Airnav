import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Teknisi() {
  const navigate = useNavigate();
  const [teknisiData, setTeknisiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchTeknisi = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "teknisi"));
        const teknisiList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTeknisiData(teknisiList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching teknisi:", err);
        setError("Gagal memuat data teknisi");
        setLoading(false);
      }
    };

    fetchTeknisi();
  }, []);

  // Handle delete technician
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus teknisi ini?")) {
      try {
        await deleteDoc(doc(db, "teknisi", id));
        setTeknisiData(prevData => prevData.filter(teknisi => teknisi.id !== id));
        alert("Teknisi berhasil dihapus");
      } catch (error) {
        console.error("Error deleting technician:", error);
        alert("Gagal menghapus teknisi");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid mt-10 max-h-screen w-screen max-w-[1370px] mx-auto p-4">
      {/* Header */}
      <div className="w-[1150px] mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-black text-center">List Teknisi</h1>
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
            {teknisiData.map((teknisi) => (
              <tr key={teknisi.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{teknisi.name}</td>
                <td className="py-2 px-4 border-b">{teknisi.category}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => navigate(`/edit-teknisi/${teknisi.id}`)}
                      className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600 rounded flex items-center justify-center">
                      <FontAwesomeIcon icon={faEdit} className="text-white text-sm" />
                    </button>
                    <button 
                      onClick={() => handleDelete(teknisi.id)}
                      className="w-[30px] h-[30px] bg-red-500 hover:bg-red-600 rounded flex items-center justify-center">
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
          <div>Showing {teknisiData.length} entries</div>
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
