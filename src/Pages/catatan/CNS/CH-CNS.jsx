import React from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import sign from '../../../assets/Icon/p1.png';
import sign2 from '../../../assets/Icon/p2.png';

const CatatanHarian = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">List Data Pemeliharaan Harian CNS</h1>
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg md:text-xl font-semibold text-blue-600 mb-4">Pemeliharaan Harian CNS</h2>
                <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div className="flex flex-wrap mb-4 md:mb-0">
                        <button
                            onClick={() => navigate('/tambah-ch-cns')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2 mb-2 md:mb-0"
                        >
                            <i className="fas fa-plus mr-2"></i> Tambah Data
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-2 md:mb-0">
                            <i className="fas fa-filter mr-2"></i> Filter & Print PDF
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
                <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div></div>
                    <div className="text-black flex items-center">
                        <label className="mr-2">Search:</label>
                        <input type="text" className="border rounded p-1" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 border-collapse bg-white">
                        <thead>
                            <tr className="text-black">
                                <th className="py-2 px-4 border border-gray-300">Tanggal / Jam</th>
                                <th className="py-2 px-4 border border-gray-300">Alat</th>
                                <th className="py-2 px-4 border border-gray-300">Kegiatan</th>
                                <th className="py-2 px-4 border border-gray-300">Teknisi</th>
                                <th className="py-2 px-4 border border-gray-300">Note</th>
                                <th className="py-2 px-4 border border-gray-300">Paraf</th>
                                <th className="py-2 px-4 border border-gray-300">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-black">
                            <tr>
                                <td className="py-2 px-4 border border-gray-300">2024-07-31 08:00:00 - 2024-07-31 08:30:00</td>
                                <td className="py-2 px-4 border border-gray-300">Router</td>
                                <td className="py-2 px-4 border border-gray-300">
                                    - Pemeliha.. <br />
                                    <a href="#" className="text-blue-600">Selengkapnya</a>
                                </td>
                                <td className="py-2 px-4 border border-gray-300">JOHN DOE <br /> JANE DOE</td>
                                <td className="py-2 px-4 border border-gray-300">Normal ops</td>
                                <td className="py-2 px-4 border border-gray-300">
                                    <img src={sign} className="w-24 h-12 mx-auto" alt="Paraf" />
                                </td>
                                <td className="py-2 px-4 border border-gray-300">
                                    <div className="flex space-x-2 justify-center">
                                        <button className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600 rounded flex items-center justify-center">
                                            <i className="fas fa-edit text-white text-sm"></i>
                                        </button>
                                        <button className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600 rounded flex items-center justify-center">
                                            <i className="fas fa-file text-white text-sm"></i>
                                        </button>
                                        <button className="w-[30px] h-[30px] bg-red-500 hover:bg-red-600 rounded flex items-center justify-center">
                                            <i className="fas fa-trash text-white text-sm"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border border-gray-300">2024-07-31 08:00:00 - 2024-07-31 08:30:00</td>
                                <td className="py-2 px-4 border border-gray-300">DVOR MWB</td>
                                <td className="py-2 px-4 border border-gray-300">
                                    - Pemeliha.. <br />
                                    <a href="#" className="text-blue-600">Selengkapnya</a>
                                </td>
                                <td className="py-2 px-4 border border-gray-300">DEIVI TUMIIR <br /> ALLAN LENGKONG</td>
                                <td className="py-2 px-4 border border-gray-300">Normal ops</td>
                                <td className="py-2 px-4 border border-gray-300">
                                    <img src={sign2} className="w-24 h-12 mx-auto" alt="Paraf" />
                                </td>
                                <td className="py-2 px-4 border border-gray-300">
                                    <div className="flex space-x-2 justify-center">
                                        <button className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600 rounded flex items-center justify-center">
                                            <i className="fas fa-edit text-white text-sm"></i>
                                        </button>
                                        <button className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600 rounded flex items-center justify-center">
                                            <i className="fas fa-file text-white text-sm"></i>
                                        </button>
                                        <button className="w-[30px] h-[30px] bg-red-500 hover:bg-red-600 rounded flex items-center justify-center">
                                            <i className="fas fa-trash text-white text-sm"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="container mx-auto p-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between items-center text-black">
                        <p>Showing 1 to 10 of 28 entries</p>
                        <div className="flex space-x-2 mt-4 md:mt-0">
                            <button className="px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50">Previous</button>
                            <button className="px-3 py-1 border border-blue-300 rounded-md bg-blue-600 text-white">1</button>
                            <button className="px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50">2</button>
                            <button className="px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50">3</button>
                            <button className="px-3 py-1 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50">Next</button>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="text-center py-4">
                <p className="text-black">Air Nav Manado</p>
            </footer>
        </div>
    );
};

export default CatatanHarian;
