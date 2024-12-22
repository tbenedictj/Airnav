import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="container-fluid flex-col sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
 
        <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">List Teknisi</h1>

            <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
                <nav className="text-gray-600">
                    <span className="mx-2">/</span>
                    <Link to="/dashboard" className="text-blue-500">Dashboard</Link>
                    <span className="mx-2">/</span>
                    <span>List Teknisi</span>
                </nav>
            </div>    

        <button
          onClick={() => navigate('/tambah-teknisi')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          <FontAwesomeIcon icon={faEdit} className="mr-2" /> Tambah Teknisi
        </button>

      {/* Table Container */}
      <div className="w-screen max-w-4xl bg-white shadow-md rounded-lg p-4">
        <table className="min-w-full border border-gray-300 bg-white">
          {/* Table Header */}
          <thead>
            <tr className="text-black border-b border-gray-300">
              <th className="py-2 px-4 border-r border-gray-300">Nama Teknisi</th>
              <th className="py-2 px-4 border-r border-gray-300">Kategori</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-black">
            {teknisiData.map((teknisi, index) => (
              <tr key={index} className="hover:bg-gray-100 border-b border-gray-300">
                <td className="py-2 px-4 border-r border-gray-300">{teknisi.name}</td>
                <td className="py-2 px-4 border-r border-gray-300">{teknisi.category}</td>
                <td className="py-2 px-4 w-[110px]">
                  <div className="flex space-x-1">
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
