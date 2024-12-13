import React from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const PeralatanCNS = () => {
    const navigate = useNavigate();

    return (
        <div className="container-fluid w-full mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4 text-black">List Peralatan CNS</h1>
            
            {/* Section for Table Header and Controls */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-blue-600 mb-4">Peralatan CNS</h2>
                
                {/* Controls: Add button, Entries display, Search */}
                <div className="flex justify-between mb-4">
                    <div>
                        <button 
                            onClick={() => navigate('/tambah-alat-cns')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
                        >
                            <i className="fas fa-plus mr-2"></i> Tambah Alat
                        </button>
                    </div>
                    <div className="flex items-center text-black">
                        <label className="mr-2">Show</label>
                        <select className="border rounded p-1 text-black">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                            <option>100</option>
                        </select> 
                        <span className="ml-2">entries</span>
                    </div>
                </div>
                
                <div className="flex justify-between mb-4">
                    <div></div>
                    <div className="text-black">
                        <label className="mr-2">Search:</label>
                        <input type="text" className="border rounded p-1" />
                    </div>
                </div>

                {/* Table Displaying Equipment Data */}
                <table className="min-w-full border border-gray-300 border-collapse bg-white">
                    <thead>
                        <tr className="text-black">
                            <th className="py-2 px-4 border border-gray-300" style={{ width: '300px' }}>Nama Alat</th>
                            <th className="py-2 px-4 border border-gray-300" style={{ width: '300px' }}>Kategori</th>
                            <th className="py-2 px-4 border border-gray-300" style={{ width: '300px' }}>Frekuensi</th>
                            <th className="py-2 px-4 border border-gray-300" style={{ width: '300px' }}>Status</th>
                            <th className="py-2 px-4 border border-gray-300" style={{ width: '300px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {/* Data Row 1 */}
                        <tr>
                            <td className="py-2 px-4 border border-gray-300">DME MWB</td>
                            <td className="py-2 px-4 border border-gray-300">Surveillance</td>
                            <td className="py-2 px-4 border border-gray-300">CHANNEL 32</td>
                            <td className="py-2 px-4 border border-gray-300">Normal ops</td>
                            <td className="py-2 px-4 border border-gray-300">
                                <div className="flex space-x-2">
                                    <button className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600 rounded flex items-center justify-center">
                                        <i className="fas fa-edit text-white text-sm"></i>
                                    </button>
                                    <button className="w-[30px] h-[30px] bg-red-500 hover:bg-red-600 rounded flex items-center justify-center">
                                        <i className="fas fa-trash text-white text-sm"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        {/* Data Row 2 */}
                        <tr>
                            <td className="py-2 px-4 border border-gray-300">NDB MWB</td>
                            <td className="py-2 px-4 border border-gray-300">Navigation</td>
                            <td className="py-2 px-4 border border-gray-300">320 KHz</td>
                            <td className="py-2 px-4 border border-gray-300">Normal ops</td>
                            <td className="py-2 px-4 border border-gray-300">
                                <div className="flex space-x-2">
                                    <button className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600 rounded flex items-center justify-center">
                                        <i className="fas fa-edit text-white text-sm"></i>
                                    </button>
                                    <button className="w-[30px] h-[30px] bg-red-500 hover:bg-red-600 rounded flex items-center justify-center">
                                        <i className="fas fa-trash text-white text-sm"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                    <p className="text-gray-600">Showing 1 to 10 of 28 entries</p>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Previous</button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PeralatanCNS;
