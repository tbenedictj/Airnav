import React from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const PeralatanSup = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-black">List Peralatan Support</h1>
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-blue-600 mb-4">Peralatan Support</h2>
                <div className="flex justify-between mb-4">
                    <div>
                        <button 
                            onClick={() => navigate('/tambah-catatan')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
                        >
                            <i className="fas fa-plus"></i> Tambah Alat
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
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="text-black">
                            <th className="py-2 px-4 border-b">Nama Alat</th>
                            <th className="py-2 px-4 border-b">kategori</th>
                            <th className="py-2 px-4 border-b">Frekuensi</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        <tr>
                            <td className="py-2 px-4 border-b">DME MWB</td>
                            <td className="py-2 px-4 border-b">Surveillance</td>
                            <td className="py-2 px-4 border-b">CHANNEL 32</td>
                            <td className="py-2 px-4 border-b">Normal ops</td>
                            <td className="py-2 px-4 border-b">
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
                        <tr>
                            <td className="py-2 px-4 border-b">DME MWB</td>
                            <td className="py-2 px-4 border-b">Surveillance</td>
                            <td className="py-2 px-4 border-b">CHANNEL 32</td>
                            <td className="py-2 px-4 border-b">Normal ops</td>
                            <td className="py-2 px-4 border-b">
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
                <div className="pagination">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600">Showing 1 to 10 of 28 entries</p>
                        <div className="flex space-x-2">
                            <button className="btn btn-secondary">Previous</button>
                            <button className="btn btn-primary">1</button>
                            <button className="btn btn-secondary">2</button>
                            <button className="btn btn-secondary">3</button>
                            <button className="btn btn-secondary">Next</button>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="text-center py-4">
                <p className="text-gray-600">Air Nav Manado</p>
            </footer>
        </div>
    );
};

export default PeralatanSup;
