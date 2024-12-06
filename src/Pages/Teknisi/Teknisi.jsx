import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

function Teknisi() {
  const [teknisiList, setTeknisiList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeknisi, setEditingTeknisi] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'CNS',
    status: 'Active'
  });
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new technician
  const handleAddTeknisi = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'teknisi'), formData);
      const newTeknisi = { id: docRef.id, ...formData };
      setTeknisiList(prev => [...prev, newTeknisi]);
      setIsModalOpen(false);
      setFormData({ name: '', category: 'CNS', status: 'Active' });
    } catch (err) {
      console.error('Error adding teknisi:', err);
      setError('Failed to add technician');
    }
  };

  // Delete technician
  const handleDeleteTeknisi = async (id) => {
    if (window.confirm('Are you sure you want to delete this technician?')) {
      try {
        await deleteDoc(doc(db, 'teknisi', id));
        setTeknisiList(prev => prev.filter(teknisi => teknisi.id !== id));
      } catch (err) {
        console.error('Error deleting teknisi:', err);
        setError('Failed to delete technician');
      }
    }
  };

  // Edit technician
  const handleEditTeknisi = async (e) => {
    e.preventDefault();
    try {
      const teknisiRef = doc(db, 'teknisi', editingTeknisi.id);
      await updateDoc(teknisiRef, formData);
      setTeknisiList(prev => prev.map(teknisi => 
        teknisi.id === editingTeknisi.id ? { ...teknisi, ...formData } : teknisi
      ));
      setEditingTeknisi(null);
      setFormData({ name: '', category: 'CNS', status: 'Active' });
    } catch (err) {
      console.error('Error updating teknisi:', err);
      setError('Failed to update technician');
    }
  };

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
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold text-blue-600">Teknisi</div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Tambah Teknisi
            </button>
          </div>

          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Nama Teknisi</th>
                <th className="px-4 py-2">Kategori</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {teknisiList.map((teknisi) => (
                <tr key={teknisi.id} className="border-b">
                  <td className="px-4 py-2">{teknisi.name}</td>
                  <td className="px-4 py-2">{teknisi.category}</td>
                  <td className="px-4 py-2">{teknisi.status}</td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => {
                        setEditingTeknisi(teknisi);
                        setFormData(teknisi);
                        setIsModalOpen(true);
                      }}
                      className="bg-green-500 text-white px-2 py-1 rounded-lg mr-2 hover:bg-green-600"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button 
                      onClick={() => handleDeleteTeknisi(teknisi.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Teknisi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingTeknisi ? 'Edit Teknisi' : 'Tambah Teknisi'}
              </h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTeknisi(null);
                  setFormData({ name: '', category: 'CNS', status: 'Active' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={editingTeknisi ? handleEditTeknisi : handleAddTeknisi}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nama Teknisi
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Kategori
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="CNS">CNS</option>
                  <option value="Support">Support</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingTeknisi ? 'Update' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teknisi;
