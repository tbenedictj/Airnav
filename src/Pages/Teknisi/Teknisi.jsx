import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const API_URL = 'http://localhost:5000/api';

function Teknisi() {
  const navigate = useNavigate();
  const [teknisiData, setTeknisiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch teknisi data
  const fetchTeknisi = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/teknisi`);
      setTeknisiData(response.data);
    } catch (error) {
      setError('Error fetching teknisi data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new teknisi
  const addTeknisi = async (teknisiData) => {
    try {
      const response = await axios.post(`${API_URL}/teknisi`, teknisiData);
      setTeknisiData([...teknisiData, response.data]);
    } catch (error) {
      setError('Error adding teknisi');
      console.error('Error:', error);
    }
  };

  // Update teknisi
  const updateTeknisi = async (id, teknisiData) => {
    try {
      const response = await axios.put(`${API_URL}/teknisi/${id}`, teknisiData);
      setTeknisiData(teknisiData.map(item => 
        item.id === id ? response.data : item
      ));
    } catch (error) {
      setError('Error updating teknisi');
      console.error('Error:', error);
    }
  };

  // Delete teknisi
  const deleteTeknisi = async (id) => {
    try {
      await axios.delete(`${API_URL}/teknisi/${id}`);
      setTeknisiData(teknisiData.filter(item => item.id !== id));
    } catch (error) {
      setError('Error deleting teknisi');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchTeknisi();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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

      {/* Table Container */}
      <div className="w-screen max-w-4xl bg-white shadow-md rounded-lg p-4">
        <table className="min-w-full border border-gray-300 bg-white">
          {/* Table Header */}
          <thead>
            <tr className="text-black border-b border-gray-300">
              <th className="py-2 px-4 border-r border-gray-300">Nama Teknisi</th>
              <th className="py-2 px-4 border-r border-gray-300">Kategori</th>
              <th className="py-2 px-4 border-r border-gray-300">Aksi</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-black">
            {teknisiData.map((teknisi, index) => (
              <tr key={index} className="hover:bg-gray-100 border-b border-gray-300">
                <td className="py-2 px-4 border-r border-gray-300">{teknisi.name}</td>
                <td className="py-2 px-4 border-r border-gray-300">{teknisi.category}</td>
                <td className="py-2 px-4 border-r border-gray-300">
                  <button className="px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50" onClick={() => navigate(`/teknisi/${teknisi.id}/edit`)}><FontAwesomeIcon icon={faEdit} /></button>
                  <button className="px-3 py-1 border border-red-300 rounded-md text-red-600 hover:bg-red-50" onClick={() => deleteTeknisi(teknisi.id)}><FontAwesomeIcon icon={faTrash} /></button>
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
