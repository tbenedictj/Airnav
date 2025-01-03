import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { db } from "../../../../config/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../../../assets/Icon/logo2.png"

const LKSupPDF = () => {
  const navigate = useNavigate();
  const [laporanList, setLaporanList] = useState([]);
  const [alatList, setAlatList] = useState([]); // State to store equipment data
  const [loading, setLoading] = useState(true);
  const [filterTanggalMulai, setFilterTanggalMulai] = useState(""); // Start date state
  const [filterTanggalAkhir, setFilterTanggalAkhir] = useState(""); // End date state
  const [filterAlat, setFilterAlat] = useState(""); // Equipment filter state
  const [filterStatus, setFilterStatus] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reports
        const laporanRef = collection(db, "LaporanSupport");
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
    const matchesStatus = filterStatus === "" || laporan.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesTanggal && matchesAlat && matchesStatus;
  });

  // Pagination
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedLaporan = filteredLaporan.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredLaporan.length / entriesPerPage);

  
  const handlePrint = () => {
    if (filteredLaporan.length === 0) {
      alert("Tidak ada data untuk dicetak.");
      return;
    }
  
    const pdf = new jsPDF();
  
    // Header dengan logo dan teks
    pdf.addImage(logo, "PNG", 10, 12, 15, 15); // Tambahkan logo
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
  
    const pageWidth = pdf.internal.pageSize.getWidth();
    const headerText = "CATATAN FASILITAS & KEGIATAN";
    const textWidth = pdf.getTextWidth(headerText);
    const xCenterPosition = (pageWidth - textWidth) / 2;
  
    pdf.text(headerText, xCenterPosition, 18); // Teks header
    pdf.setDrawColor(0); // Warna garis (hitam)
    pdf.setLineWidth(0.2); // Ketebalan garis
    pdf.line(10, 30, 200, 30); // Garis horizontal
  
    // Konten utama
    const tableColumn = ["Tanggal", "Peralatan", "Status", "Keterangan"];
    const tableRows = [];
    filteredLaporan.forEach((laporan) => {
      const laporanData = [
        laporan.tanggal || "-",
        laporan.peralatan || "-",
        laporan.status || "-",
        laporan.keterangan || "-",
      ];
      tableRows.push(laporanData);
    });
  
    const startYContent = 35;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text("Laporan Kegiatan & Kerusakan Support", 14, startYContent);
    pdf.text(`Tanggal: ${new Date().toLocaleDateString()}`, 14, startYContent + 7);
    pdf.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: startYContent + 15,
    });
  
    // Membuka halaman baru untuk pratinjau PDF
    const pdfURL = pdf.output("dataurlstring");
    const previewWindow = window.open();
    previewWindow.document.write(`
      <html>
        <head>
          <title>Pratinjau PDF</title>
        </head>
        <body>
          <iframe src="${pdfURL}" style="width:100%; height:100%; border:none;"></iframe>
          <button style="position: fixed; top: 10px; left: 10px; padding: 10px; background: blue; color: white; border: none; cursor: pointer;" onclick="window.savePDF()">Simpan PDF</button>
        </body>
        <script>
          window.savePDF = () => {
            const link = document.createElement('a');
            link.href = '${pdfURL}';
            link.download = 'laporan-cns.pdf';
            link.click();
          };
        </script>
      </html>
    `);
  };
  
  

  return (
    <div className="container-fluid flex-col sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Filter Data For PDF</h1>

      <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
        <nav className="text-gray-600">
          <span className="mx-2">/</span>
          <Link to="/lk-sup" className="text-blue-500">Laporan Kegiatan & Kerusakan</Link>
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
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded w-[300px] p-2"
            >
              <option value="">Semua</option>
              <option value="open">Maintenance</option>
              <option value="close">Normal Ops</option>
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

export default LKSupPDF;
