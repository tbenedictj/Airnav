import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { db } from '../../../config/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import sign from '../../../assets/Icon/p1.png';
import sign2 from '../../../assets/Icon/p2.png';

const LaporanKegiatanSup = () => {
    const navigate = useNavigate();
    const [laporanList, setLaporanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [expandedRows, setExpandedRows] = useState({});
    const [expandedAlat, setExpandedAlat] = useState({});
    const [expandedTeknisi, setExpandedTeknisi] = useState({});

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
        else if (type === 'teknisi') {
            setExpandedTeknisi(prev => ({
                ...prev,
                [id]: !prev[id]
            }));
    }
    };

    const fetchLaporan = async () => {
        try {
            const laporanRef = collection(db, 'LaporanSupport');
            const q = query(laporanRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const laporan = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLaporanList(laporan);
            setLoading(false);
            setPeralatanSup(peralatanData);
        } catch (error) {
            console.error('Error fetching laporan:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            try {
                await deleteDoc(doc(db, 'LaporanSupport', id));
                await fetchLaporan(); // Refresh data after deletion
                alert('Data berhasil dihapus');
            } catch (error) {
                console.error('Error deleting document:', error);
                alert('Terjadi kesalahan saat menghapus data');
            }
        }
    };

    useEffect(() => {
        fetchLaporan();
    }, []);

    // Filter laporan based on search term
    const filteredLaporan = laporanList.filter(laporan =>
        laporan.peralatan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        laporan.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        laporan.aktivitas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(laporan.teknisi) ? 
            laporan.teknisi.join(' ').toLowerCase().includes(searchTerm.toLowerCase()) :
            laporan.teknisi?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container-fluid flex-col sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Title Section */}
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">List Laporan Kegiatan & Kerusakan Support</h1>

            <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
                <nav className="text-gray-600">
                    <span className="mx-2">/</span>
                    <Link to="/dashboard" className="text-blue-500">Dashboard</Link>
                    <span className="mx-2">/</span>
                    <span>List Laporan Kegiatan & Kerusakan Support</span>
                </nav>
            </div>

            
            {/* Main Content Section */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-blue-600 mb-4">Laporan Kegiatan & Kerusakan Support</h2>

                {/* Top Action Bar */}
                <div className="flex justify-between mb-4">
                    <div>
                        <button 
                            onClick={() => navigate('/tambah-lk-sup')}
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
                        <select className="border rounded p-1 text-black" value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
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
                <table className="min-w-full border border-gray-300 border-collapse bg-white table-fixed">
                    <thead>
                        <tr className="text-black">
                            <th className="py-2 px-4 border border-gray-300 ">Tanggal / Jam</th>
                            <th className="py-2 px-4 border border-gray-300 ">Alat</th>
                            <th className="py-2 px-4 border border-gray-300 ">Kegiatan</th>
                            <th className="py-2 px-4 border border-gray-300 ">Teknisi</th>
                            <th className="py-2 px-4 border border-gray-300 ">Status</th>
                            <th className="py-2 px-4 border border-gray-300 ">Paraf</th>
                            <th className="py-2 px-4 border border-gray-300 ">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {filteredLaporan.slice(0, entriesPerPage).map((laporan) => (
                            <tr key={laporan.id}>
                                <td className="py-2 px-4 border border-gray-300 whitespace-nowrap overflow-hidden overflow-ellipsis">
                                    {laporan.tanggal} {laporan.jamSelesai}
                                </td>
                                <td className="py-2 px-4 border max-w-[150px] border-gray-300 whitespace-nowrap overflow-hidden overflow-ellipsis">
                                    <div className="break-words whitespace-pre-wrap">
                                        {laporan.peralatan?.length > 20 ? (
                                            <>
                                                <span>
                                                    {expandedAlat[laporan.id]
                                                        ? laporan.peralatan
                                                        : `${laporan.peralatan.substring(0, 20)}...`
                                                    }
                                                </span>
                                                <span
                                                    className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer block mt-1"
                                                    onClick={() => toggleRowExpansion(laporan.id, 'peralatan')}
                                                >
                                                    {expandedAlat[laporan.id] ? 'Sembunyikan' : 'Selengkapnya'}
                                                </span>    
                                            </>
                                        ) : (
                                            <span>{laporan.peralatan}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-2 px-4 border border-gray-300 max-w-[300px]">
                                    <div className="break-words whitespace-pre-wrap">
                                        {laporan.aktivitas?.length > 50 ? (
                                            <>
                                                <span>
                                                    {expandedRows[laporan.id] 
                                                        ? laporan.aktivitas
                                                        : `${laporan.aktivitas.substring(0, 50)}...`
                                                    }
                                                </span>
                                                <span 
                                                    className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer block mt-1"
                                                    onClick={() => toggleRowExpansion(laporan.id, 'aktivitas')}
                                                >
                                                    {expandedRows[laporan.id] ? 'Sembunyikan' : 'Selengkapnya'}
                                                </span>
                                            </>
                                        ) : (
                                            <span>{laporan.aktivitas}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-2 px-4 border border-gray-300 max-w-[128px]">
                                    <div className="break-words whitespace-pre-wrap">
                                        {Array.isArray(laporan.teknisi) ? (
                                            laporan.teknisi.join(', ').length > 20 ? (
                                                <>
                                                    <span>
                                                        {expandedTeknisi[laporan.id] 
                                                            ? laporan.teknisi.join(', ')
                                                            : `${laporan.teknisi.join(', ').substring(0, 20)}...`
                                                        }
                                                    </span>
                                                    <span 
                                                        className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer block mt-1"
                                                        onClick={() => toggleRowExpansion(laporan.id, 'teknisi')}
                                                    >
                                                        {expandedTeknisi[laporan.id] ? 'Sembunyikan' : 'Selengkapnya'}
                                                    </span>
                                                </>
                                            ) : (
                                                <span>{laporan.teknisi.join(', ')}</span>
                                            )
                                        ) : (
                                            <span>{laporan.teknisi || '-'}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-2 px-4 border border-gray-300">
                                    <span className={`px-2 py-1 rounded text-xs sm:text-sm ${laporan.status === 'open' ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white'}`}>
                                            {laporan.status === 'open' ? 'Maintenance' : 'Normal Ops'}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border border-gray-300 text-center">
                                    {laporan.signature && (
                                        <img src={laporan.signature} className="w-12 h-12 object-contain mx-auto" alt="Paraf" />
                                    )}
                                </td>
                                <td className="py-2 px-4 border border-gray-300">
                                    <div className="flex space-x-2">
                                    <button 
                                        className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600 rounded flex items-center justify-center"
                                        onClick={() => navigate(`/edit-lk-sup/${laporan.id}`)}
                                    >
                                        <i className="fas fa-edit text-white text-sm"></i>
                                    </button>
                                    <button 
                                        className="w-[30px] h-[30px] bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center"
                                        onClick={() => navigate(`/detail-lk-sup/${laporan.id}`)}
                                    >
                                        <i className="fas fa-file text-white text-sm"></i>
                                    </button>
                                    <button 
                                        className="w-[30px] h-[30px] bg-red-500 hover:bg-red-600 rounded flex items-center justify-center"
                                        onClick={() => handleDelete(item.id)}
                                    >
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
                        <p>Showing 1 to {Math.min(entriesPerPage, filteredLaporan.length)} of {filteredLaporan.length} entries</p>
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
        </div>
    );
};

export default LaporanKegiatanSup;
