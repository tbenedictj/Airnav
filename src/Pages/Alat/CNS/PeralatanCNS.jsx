import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const PeralatanCNS = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState('10');
    const [searchTerm, setSearchTerm] = useState('');

    // Sample data - replace with your actual data fetching logic
    const sampleData = [
        { namaAlat: 'DME MWB', kategori: 'Surveillance', frekuensi: 'CHANNEL 32', status: 'Normal ops' },
        { namaAlat: 'NDB MWB', kategori: 'Navigation', frekuensi: '320 KHz', status: 'Normal ops' },
        // Add more sample data as needed
    ];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-black text-center">List Peralatan CNS</h1>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-blue-600 text-lg font-semibold mb-4">Peralatan CNS</h2>

                {/* Add Button */}
                <div className="flex justify-between flex-wrap gap-4 mb-6">
                    <button
                        onClick={() => navigate('/tambah-alat-cns')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                    >
                        + Tambah Alat
                    </button>

                    {/* Entries and Search Controls */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center text-sm sm:text-base">
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
                        <div className="flex items-center text-sm sm:text-base">
                            <span className="mr-2">Search:</span>
                            <input
                                type="text"
                                className="border rounded px-2 py-1 w-32 sm:w-48"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="text-black border-b border-gray-300 bg-gray-100">
                                <th className="border-gray-300 w-[300px] border-r px-4 py-2 text-left text-sm sm:text-base">Nama Alat ↕</th>
                                <th className="border-gray-300 w-[200px] border-r px-4 py-2 text-left text-sm sm:text-base">Kategori ↕</th>
                                <th className="border-gray-300 w-[150px] border-r px-4 py-2 text-left text-sm sm:text-base">Frekuensi ↕</th>
                                <th className="border-gray-300 border-r px-4 py-2 text-left text-sm sm:text-base">Status ↕</th>
                                <th className="px-4 py-2 text-center text-sm sm:text-base">Action ↕</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleData.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 border-b border-gray-300">
                                    <td className="border-gray-300 border-r px-4 py-2 text-sm sm:text-base">{item.namaAlat}</td>
                                    <td className="border-gray-300 border-r px-4 py-2 text-sm sm:text-base">{item.kategori}</td>
                                    <td className="border-gray-300 border-r px-4 py-2 text-sm sm:text-base">{item.frekuensi}</td>
                                    <td className="px-4 py-2">
                                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs sm:text-sm">
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

export default PeralatanCNS;
