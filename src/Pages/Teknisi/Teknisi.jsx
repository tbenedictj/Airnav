import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

function Teknisi() {
  const [teknisiList, setTeknisiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch technicians data
  useEffect(() => {
    const fetchTeknisi = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'teknisi'));
        const teknisiData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTeknisiList(teknisiData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teknisi:', err);
        setError('Failed to load technicians data');
        setLoading(false);
      }
    };

    fetchTeknisi();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container">
      <div className="table-container">
        <h1 className="text-2xl font-bold mb-4">List Teknisi</h1>
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Nama Teknisi</th>
                <th className="px-4 py-2">Kategori</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {teknisiList.map((teknisi) => (
                <tr key={teknisi.id} className="border-b">
                  <td className="px-4 py-2">{teknisi.name}</td>
                  <td className="px-4 py-2">{teknisi.category}</td>
                  <td className="px-4 py-2">{teknisi.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Teknisi;
