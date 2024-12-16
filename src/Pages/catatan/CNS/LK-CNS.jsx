import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { db } from '../../../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import sign from '../../../assets/Icon/p1.png';
import sign2 from '../../../assets/Icon/p2.png';

const LaporanKegiatanCNS = () => {
    const navigate = useNavigate();
    const [laporanList, setLaporanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    useEffect(() => {
        const fetchLaporan = async () => {
            try {
                const laporanRef = collection(db, 'LaporanCNS');
                const q = query(laporanRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const laporan = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setLaporanList(laporan);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching laporan:', error);
                setLoading(false);
            }
        };

        fetchLaporan();
    }, []);

    // Filter laporan based on search term
    const filteredLaporan = laporanList.filter(laporan =>
        laporan.peralatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        laporan.aktivitas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        laporan.teknisi.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Title Section */}
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">List Laporan Kegiatan & Kerusakan CNS</h1>
            
            {/* Main Content Section */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-blue-600 mb-4">Laporan Kegiatan & Kerusakan CNS</h2>

                {/* Top Action Bar */}
                <div className="flex justify-between mb-4">
                    <div>
                        <button 
                            onClick={() => navigate('/tambah-lk')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
                        >
                            <i className="fas fa-plus mr-2"></i> Tambah Data
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                            <i className="fas fa-filter mr-2"></i> Filter & Print PDF
                        </button>
                    </div>
                    <div className="flex items-center text-black">
                        <label className="mr-2">Show</label>
                        <select className="border rounded p-1 text-black" value={entriesPerPage} onChange={(e) => setEntriesPerPage(e.target.value)}>
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                            <option>100</option>
                        </select>
                        <span className="ml-2">entries</span>
                    </div>
                </div>

                {/* Search Bar Section */}
                <div className="flex justify-between mb-4">
                    <div></div>
                    <div className="text-black">
                        <label className="mr-2">Search:</label>
                        <input type="text" className="border rounded p-1" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                {/* Table Section */}
                <table className="min-w-full border border-gray-300 border-collapse bg-white">
                    <thead>
                        <tr className="text-black">
                            <th className="py-2 px-4 border border-gray-300">Tanggal / Jam</th>
                            <th className="py-2 px-4 border border-gray-300">Alat</th>
                            <th className="py-2 px-4 border border-gray-300" style={{ width: '300px' }}>Kegiatan</th>
                            <th className="py-2 px-4 border border-gray-300">Teknisi</th>
                            <th className="py-2 px-4 border border-gray-300">Note</th>
                            <th className="py-2 px-4 border border-gray-300">Paraf</th>
                            <th className="py-2 px-4 border border-gray-300">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {filteredLaporan.slice(0, entriesPerPage).map((laporan, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border border-gray-300">{laporan.tanggal}</td>
                                <td className="py-2 px-4 border border-gray-300">{laporan.peralatan}</td>
                                <td className="py-2 px-4 border border-gray-300">
                                    - {laporan.aktivitas} <br />
                                    <a href="#" className="text-blue-600">Selengkapnya</a>
                                </td>
                                <td className="py-2 px-4 border border-gray-300">{laporan.teknisi}</td>
                                <td className="py-2 px-4 border border-gray-300">{laporan.note}</td>
                                <td className="py-2 px-4 border border-gray-300">
                                    <img src={sign} className="w-24 h-12" alt="Paraf" />
                                </td>
                                <td className="py-2 px-4 border border-gray-300">
                                    <div className="flex space-x-2">
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
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Section */}
            <div className="container mx-auto p-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex justify-between items-center text-black">
                        <p>Showing 1 to {entriesPerPage} of {filteredLaporan.length} entries</p>
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

            {/* Footer Section */}
            <footer className="text-center py-4">
                <p className="text-black">Air Nav Manado</p>
            </footer>
        </div>
    );
};

export default LaporanKegiatanCNS;
