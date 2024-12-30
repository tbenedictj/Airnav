import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { db } from "../../../../config/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const CMSupPDF = () => {
  const navigate = useNavigate();
  const [laporanList, setLaporanList] = useState([]);
  const [alatList, setAlatList] = useState([]); // State to store equipment data
  const [loading, setLoading] = useState(true);
  const [filterTanggalMulai, setFilterTanggalMulai] = useState(""); // Start date state
  const [filterTanggalAkhir, setFilterTanggalAkhir] = useState(""); // End date state
  const [filterAlat, setFilterAlat] = useState(""); // Equipment filter state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reports
        const laporanRef = collection(db, "CM-Sup");
        const q = query(laporanRef, orderBy("createdAt", "desc"));
        const laporanSnapshot = await getDocs(q);
        const laporan = laporanSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLaporanList(laporan);

        // Fetch equipment list
        const peralatanCollection = collection(db, "PeralatanSupport");
        const peralatanSnapshot = await getDocs(peralatanCollection);
        const peralatanList = peralatanSnapshot.docs.map((doc) => doc.data().namaAlat);
        setAlatList(peralatanList);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter reports based on criteria
  const filteredLaporan = laporanList.filter((laporan) => {
    const matchesTanggal =
      (filterTanggalMulai === "" || new Date(laporan.tanggal) >= new Date(filterTanggalMulai)) &&
      (filterTanggalAkhir === "" || new Date(laporan.tanggal) <= new Date(filterTanggalAkhir));
    
    const matchesAlat = filterAlat === "" || laporan.peralatan?.toLowerCase().includes(filterAlat.toLowerCase());

    return matchesTanggal && matchesAlat;
  });

  // Log the filtered laporan data
  console.log("Filtered Laporan: ", filteredLaporan);

  // Pagination
  const entriesPerPage = 10;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedLaporan = filteredLaporan.slice(startIndex, endIndex);

  // Log paginated laporan
  console.log("Paginated Laporan: ", paginatedLaporan);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredLaporan.length / entriesPerPage);

  // Print functionality
  const handlePrint = () => {
    const printContent = document.getElementById("printContent");
    const newWindow = window.open();
    newWindow.document.write('<html><head><title>Print Report</title></head><body>');
    newWindow.document.write(printContent.innerHTML);
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="container-fluid flex-col sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Filter Data For PDF</h1>

      <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
        <nav className="text-gray-600">
          <span className="mx-2">/</span>
          <Link to="/ch-cns" className="text-blue-500">Data Pemeliharaan Mingguan Support</Link>
          <span className="mx-2">/</span>
          <span>Filter Data PDF</span>
        </nav>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">Filter Data</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1">Tanggal Mulai:</label>
            <input
              type="date"
              value={filterTanggalMulai}
              onChange={(e) => setFilterTanggalMulai(e.target.value)}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1">Tanggal Akhir:</label>
            <input
              type="date"
              value={filterTanggalAkhir}
              onChange={(e) => setFilterTanggalAkhir(e.target.value)}
              className="border rounded w-[300px] p-2"
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1">Peralatan</label>
            <select
              name="peralatan"
              value={filterAlat}
              onChange={(e) => setFilterAlat(e.target.value)}
              className="border rounded w-[300px] p-2"
            >
              <option value="">Pilih Peralatan</option>
              {alatList.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Print to PDF
        </button>
      </div>
    </div>
  );
};

export default CMSupPDF;
