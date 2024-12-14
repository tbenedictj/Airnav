import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const PeralatanSup = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState('10');
    const [searchTerm, setSearchTerm] = useState('');

    // Sample data - replace with your actual data fetching logic
    const sampleData = [
        {
            namaAlat: 'AC 2 PK AUX RUANG MANGUNI KANAN',
            kategori: 'Mekanikal',
            snOutdoor: '',
            snIndoor: '',
            tahun: '2023',
            status: 'Normal Ops'
        },
        {
            namaAlat: 'AC 2 PK AUX RUANG MANGUNI KIRI',
            kategori: 'Mekanikal',
            snOutdoor: '',
            snIndoor: '',
            tahun: '2023',
            status: 'Normal Ops'
        },
        // Add more sample data as needed
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">List Peralatan Support</h1>
            
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-blue-600 text-lg font-semibold mb-4">Peralatan Support</h2>
                
                {/* Add Button */}
                <button 
                    onClick={() => navigate('/tambah-alat-sup')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-600"
                >
                    + Tambah Alat
                </button>

                {/* Entries and Search Controls */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <span className="mr-2">Show</span>
                        <select 
                            className="border rounded px-2 py-1"
                            value={entries}
                            onChange={(e) => setEntries(e.target.value)}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <span className="ml-2">entries</span>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-2">Search:</span>
                        <input
                            type="text"
                            className="border rounded px-2 py-1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="text-black border-b border-gray-300">
                                <th className="border-gray-300 border-r px-4 py-2 text-left">Nama Alat ↕</th>
                                <th className="border-gray-300 border-r px-4 py-2 text-left">Kategori ↕</th>
                                <th className="border-gray-300 border-r px-4 py-2 text-left">SN Outdoor ↕</th>
                                <th className="border-gray-300 border-r px-4 py-2 text-left">SN Indoor ↕</th>
                                <th className="border-gray-300 border-r px-4 py-2 text-left">Tahun ↕</th>
                                <th className="border-gray-300 border-r px-4 py-2 text-left">Status ↕</th>
                                <th className="px-4 py-2 text-center">Action ↕</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleData.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 border-b border-gray-300">
                                    <td className="border-gray-300 border-r px-4 py-2">{item.namaAlat}</td>
                                    <td className="border-gray-300 border-r px-4 py-2">{item.kategori}</td>
                                    <td className="border-gray-300 border-r px-4 py-2">{item.snOutdoor}</td>
                                    <td className="border-gray-300 border-r px-4 py-2">{item.snIndoor}</td>
                                    <td className="border-gray-300 border-r px-4 py-2">{item.tahun}</td>
                                    <td className="px-4 py-2">
                                        <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                        <button className="text-blue-500 hover:text-blue-700 mx-1">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="text-red-500 hover:text-red-700 mx-1">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PeralatanSup;
