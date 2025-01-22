import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Approval = () => {
        const [entriesPerPage, setEntriesPerPage] = useState(10);
        const [searchTerm, setSearchTerm] = useState('');
        const [currentPage, setCurrentPage] = useState(1);


        const indexOfLastEntry = currentPage * entriesPerPage;
        const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    return (
        <div className="container-fluid flex-col sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">List Data Edit</h1>

            <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
                <nav className="text-gray-600">
                    <span className="mx-2">/</span>
                    <Link to="/dashboard" className="text-blue-500">Dashboard</Link>
                    <span className="mx-2">/</span>
                    <span>List Data Edit</span>
                </nav>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg md:text-xl font-semibold text-blue-600 mb-4">Waiting for Approval</h2>
                <div className="flex items-center text-black">
                        <label className="mr-2">Show</label>
                        <select 
                            className="border rounded p-1 text-black"
                            value={entriesPerPage}
                            onChange={(e) => {
                                setEntriesPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span className="ml-2">entries</span>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div></div>
                    <div className="text-black flex items-center">
                        <label className="mr-2">Search:</label>
                        <input 
                            type="text" 
                            className="border rounded p-1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
            </div>

            <div className="overflow-x-auto max-w-full">
                <table className="min-w-full border border-gray-300 border-collapse bg-white table-fixed">
                    <thead>
                        <tr className="text-black">
                            <th className="py-2 px-4 border border-gray-300">Tanggal / Jam</th>
                            <th className="py-2 px-4 border border-gray-300">Jenis Laporan</th>
                            <th className="py-2 px-4 border border-gray-300">Nama</th>
                            <th className="py-2 px-4 border border-gray-300">Aktivitas</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        <tr className="text-black">
                            <td className="py-2 px-4 border border-gray-300"> 09 Februari 2024 - 10.00 </td>
                            <td className="py-2 px-4 border border-gray-300"> Catatan Mingguan </td>
                            <td className="py-2 px-4 border border-gray-300"> EL Rasho Maquin </td>
                            <td className="py-2 px-4 border border-gray-300"> Lihat Selengkapnya... </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <footer className="text-center py-4">
                <p className="text-black">Air Nav Manado</p>
            </footer>            
        </div>
    );
};

export default Approval;