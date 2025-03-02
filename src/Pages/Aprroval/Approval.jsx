import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Approval = () => {
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "LaporanCNS"));
                const data = querySnapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    .filter(doc => 
                        // Only show documents that have pending changes and haven't been approved
                        doc.pendingChanges?.length > 0 && !doc.approve
                    );
                setEntries(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredEntries = entries.filter(entry =>
        entry?.peralatan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry?.aktivitas?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);

    const handleApprove = async (entry) => {
        if (!entry || !entry.id) {
            console.error("Invalid entry object");
            return;
        }

        if (!currentUser) {
            console.error("No user logged in");
            return;
        }

        const laporanRef = doc(db, "LaporanCNS", entry.id);
        try {
            const laporanDoc = await getDoc(laporanRef);
            if (!laporanDoc.exists()) {
                console.error("Document does not exist");
                return;
            }

            const data = laporanDoc.data();
            if (!data || !Array.isArray(data.pendingChanges) || data.pendingChanges.length === 0) {
                console.error("No pending changes to approve");
                return;
            }

            const pendingChange = data.pendingChanges[0];
            const updateData = {};

            // Only include fields that exist in pendingChange
            if (pendingChange.tanggal) updateData.tanggal = pendingChange.tanggal;
            if (pendingChange.jamSelesai) updateData.jamSelesai = pendingChange.jamSelesai;
            if (pendingChange.peralatan) updateData.peralatan = pendingChange.peralatan;
            if (pendingChange.aktivitas) updateData.aktivitas = pendingChange.aktivitas;
            if (pendingChange.Tx) updateData.Tx = pendingChange.Tx;
            if (pendingChange.Rx) updateData.Rx = pendingChange.Rx;
            if (pendingChange.teknisi) updateData.teknisi = pendingChange.teknisi;
            if (pendingChange.status) updateData.status = pendingChange.status;
            if (pendingChange.buktiUrl) updateData.buktiUrl = pendingChange.buktiUrl;
            if (pendingChange.userId) updateData.userId = pendingChange.userId;
            if (pendingChange.updatedAt) updateData.updatedAt = pendingChange.updatedAt;

            // Add approval metadata
            updateData.editedAt = new Date().toISOString();
            updateData.editedBy = currentUser.email;
            updateData.pendingChanges = [];
            updateData.approve = true;

            await updateDoc(laporanRef, updateData);

            // Remove the approved entry from the list
            setEntries(prevEntries => 
                prevEntries.filter(e => e.id !== entry.id)
            );
        } catch (error) {
            console.error("Error approving document:", error);
        }
    };

    const handleReject = async (entry) => {
        if (!entry || !entry.id) {
            console.error("Invalid entry object");
            return;
        }

        const laporanRef = doc(db, "LaporanCNS", entry.id);
        try {
            await updateDoc(laporanRef, {
                status: 'rejected',
                pendingChanges: [],
                approve: false
            });

            // Remove the rejected entry from the list
            setEntries(prevEntries => 
                prevEntries.filter(e => e.id !== entry.id)
            );
        } catch (error) {
            console.error("Error rejecting document:", error);
        }
    };

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
                            <th className="py-2 px-4 border border-gray-300">Approval</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {currentEntries.length > 0 ? (
                            currentEntries.map((entry, index) => (
                                <tr key={index} className="text-black">
                                    <td className="py-2 px-4 border border-gray-300">{entry.jamSelesai}</td>
                                    <td className="py-2 px-4 border border-gray-300">Laporan Kegiatan & Kerusakan</td>
                                    <td className="py-2 px-4 border border-gray-300">{entry.peralatan}</td>
                                    <td className="py-2 px-4 border border-gray-300">{entry.aktivitas}</td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        <div className="flex space-x-2">
                                            <button 
                                            className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600 rounded flex items-center justify-center"
                                            onClick={() => handleApprove(entry)}
                                            >
                                                <i className="fas fa-check text-white text-sm"></i>
                                            </button>

                                            <button 
                                            className="w-[30px] h-[30px] bg-red-500 hover:bg-red-600 rounded flex items-center justify-center"
                                            onClick={() => handleReject(entry)}
                                            >
                                                <i className="fas fa-trash text-white text-sm"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-2 px-4 border border-gray-300 text-center">No entries found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <footer className="text-center py-4">
                <p className="text-black">Air Nav Manado</p>
            </footer>
        </div>
    );
}

export default Approval;