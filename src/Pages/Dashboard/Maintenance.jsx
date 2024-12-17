import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { db } from '../../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import sign from '../../assets/Icon/p1.png';

const PeralatanOpenStatus = () => {
    const navigate = useNavigate();
    const [laporanList, setLaporanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRows, setExpandedRows] = useState({});
    const [expandedAlat, setExpandedAlat] = useState({});

    // Toggle row expansion
    const toggleRowExpansion = (id, type) => {
        if (type === 'peralatan') {
            setExpandedAlat(prev => ({
                ...prev,
                [id]: !prev[id]
            }));
        } else if (type === 'aktivitas') {
            setExpandedRows(prev => ({
                ...prev,
                [id]: !prev[id]
            }));
        }
    };

    // Fetch data from Firestore
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
                // Filter data to only include items with status 'open'
                const filteredLaporan = laporan.filter(item => item.status === 'open');
                setLaporanList(filteredLaporan);
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

    // Calculate start and end indices for pagination
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const paginatedLaporan = filteredLaporan.slice(startIndex, endIndex);

    // Change page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate total pages
    const totalPages = Math.ceil(filteredLaporan.length / entriesPerPage);

    return (
        <div className="container-fluid flex-col sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Title Section */}
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Peralatan Maintenance CNS</h1>

            {/* Main Content Section */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-blue-600 mb-4">Laporan Peralatan dengan Status Open</h2>

                {/* Top Action Bar */}
                <div className="flex justify-between mb-4">
                    <div>
                        <button
                            onClick={() => navigate('/tambah-lk')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
                        >
                            <i className="fas fa-plus mr-2"></i> Tambah Data
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
                <table className="container-fluid min-w-full h-screen border border-gray-300 border-collapse bg-white">
                    <thead>
                        <tr className="text-black">
                            <th className="py-2 px-4 border border-gray-300">Tanggal / Jam</th>
                            <th className="py-2 px-4 border border-gray-300">Alat</th>
                            <th className="py-2 px-4 border border-gray-300">Kegiatan</th>
                            <th className="py-2 px-4 border border-gray-300">Teknisi</th>
                            <th className="py-2 px-4 border border-gray-300">Status</th>
                            <th className="py-2 px-4 border border-gray-300">Paraf</th>
                            <th className="py-2 px-4 border border-gray-300">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {paginatedLaporan.map((laporan) => (
                            <tr key={laporan.id}>
                                <td className="py-2 px-4 border border-gray-300">
                                    {laporan.tanggal} {laporan.jamSelesai}
                                </td>
                                <td className="py-2 px-4 max-w-[150px] border border-gray-300">
                                    <div>
                                        {laporan.peralatan}
                                    </div>
                                </td>
                                <td className="py-2 px-4 border max-w-[300px] border-gray-300">
                                    <div className="break-words whitespace-pre-wrap">
                                        {laporan.aktivitas}
                                    </div>
                                </td>
                                <td className="py-2 px-4 border border-gray-300">{laporan.teknisi}</td>
                                <td className="py-2 px-4 border border-gray-300">
                                    <span className="px-2 py-1 rounded text-xs sm:text-sm bg-yellow-500 text-white">
                                        Maintenance
                                    </span>
                                </td>
                                <td className="py-2 px-4 border border-gray-300">
                                    <img src={sign} className="w-24 h-12" alt="Paraf" />
                                </td>
                                <td className="py-2 px-4 border border-gray-300">
                                    <div className="flex space-x-2">
                                        <button
                                            className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600 rounded flex items-center justify-center"
                                            onClick={() => navigate(`/edit-lk-cns/${laporan.id}`)}
                                        >
                                            <i className="fas fa-edit text-white text-sm"></i>
                                        </button>
                                        <button
                                            className="w-[30px] h-[30px] bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                                            onClick={() => navigate(`/detail-lk-cns/${laporan.id}`)}
                                        >
                                            <i className="fas fa-file text-white text-sm"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PeralatanOpenStatus;
