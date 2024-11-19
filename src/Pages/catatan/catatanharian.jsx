import React from 'react';

const CatatanHarian = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-black">List Data Pemeliharaan Mingguan CNS</h1>
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-blue-600 mb-4">Pemeliharaan Mingguan CNS</h2>
                <div className="flex justify-between mb-4">
                    <div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2">
                            <i className="fas fa-plus"></i> Tambah Data
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                            <i className="fas fa-filter"></i> Filter & Print PDF
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
                            <th className="py-2 px-4 border-b">Tanggal / Jam</th>
                            <th className="py-2 px-4 border-b">Alat</th>
                            <th className="py-2 px-4 border-b">Kegiatan</th>
                            <th className="py-2 px-4 border-b">Teknisi</th>
                            <th className="py-2 px-4 border-b">Note</th>
                            <th className="py-2 px-4 border-b">Paraf</th>
                            <th className="py-2 px-4 border-b">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        <tr>
                            <td className="py-2 px-4 border-b">2024-07-31 08:00:00 - 2024-07-31 08:30:00</td>
                            <td className="py-2 px-4 border-b">DME MWB</td>
                            <td className="py-2 px-4 border-b">
                                - Pemeliha.. <br />
                                <a href="#" className="text-blue-600">Selengkapnya</a>
                            </td>
                            <td className="py-2 px-4 border-b">DEIVI TUMIIR <br /> ALLAN LENGKONG</td>
                            <td className="py-2 px-4 border-b">Normal ops</td>
                            <td className="py-2 px-4 border-b">
                                <img src="https://placehold.co/20x20" alt="Paraf" />
                            </td>
                            <td className="py-2 px-4 border-b">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2 px-4 border-b">2024-07-31 08:00:00 - 2024-07-31 08:30:00</td>
                            <td className="py-2 px-4 border-b">DVOR MWB</td>
                            <td className="py-2 px-4 border-b">
                                - Pemeliha.. <br />
                                <a href="#" className="text-blue-600">Selengkapnya</a>
                            </td>
                            <td className="py-2 px-4 border-b">DEIVI TUMIIR <br /> ALLAN LENGKONG</td>
                            <td className="py-2 px-4 border-b">Normal ops</td>
                            <td className="py-2 px-4 border-b">
                                <img src="https://placehold.co/20x20" alt="Paraf" />
                            </td>
                            <td className="py-2 px-4 border-b">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="container mx-auto p-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex justify-between items-center text-black">
                        <p>Showing 1 to 10 of 28 entries</p>
                        <div className="flex items-center space-x-2">
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
