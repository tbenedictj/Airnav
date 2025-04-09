import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../config/firebase";
import jsPDF from "jspdf";
import logo from "../../../../assets/Icon/logo2.png";

const CMCnsSinglePDF = () => {
  const { id } = useParams();
  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(true);
 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "CM-CNS", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLaporan(docSnap.data());
        } else {
          console.error("Dokumen tidak ditemukan");
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePrintPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
  
    pdf.addImage(logo, "PNG", 10, 12, 15, 15);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    const title = "CATATAN PEMELIHARAAN MINGGUAN - CNS";
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, 18);
  
    pdf.setLineWidth(0.2);
    pdf.line(10, 30, pageWidth - 10, 30);
  
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    let y = 38;
  
    // Padding dan lebar teks yang bisa digunakan
    const paddingKiri = 45;
    const paddingKanan = 20;
    const usableWidth = pageWidth - paddingKiri - paddingKanan;
  
    const printText = (label, value) => {
      pdf.setFont(undefined, "bold");
      pdf.text(`${label}:`, 14, y);
      const lines = pdf.splitTextToSize(value || "-", usableWidth);
      pdf.setFont(undefined, "normal");
      lines.forEach((line, index) => {
        if (index === 0) {
          pdf.text(line, paddingKiri, y);
        } else {
          y += 6;
          pdf.text(line, paddingKiri, y);
        }
      });
      y += 12;
    };
  
    printText("Tanggal", laporan.tanggal);
    printText("Jam Selesai", laporan.jamSelesai);
    printText("Peralatan", laporan.peralatan);
    printText("Aktivitas", laporan.aktivitas);
    printText("Teknisi", laporan.teknisi);
    printText("Note", laporan.note);
  
    if (laporan.bukti) {
      pdf.setFont(undefined, "bold");
      pdf.text("Paraf:", 14, y);
      y += 4;
      pdf.addImage(laporan.bukti, "PNG", 14, y + 4, 40, 40);
    }
  
    pdf.save(`laporan-${id}.pdf`);
  };
  

  if (loading) return <p>Loading...</p>;
  if (!laporan) return <p>Data tidak ditemukan.</p>;

  return (
    <div className="container-fluid flex-col sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">PDF Catatan Mingguan</h1>
    
        <div className="bg-gray-100 p-3 shadow rounded-lg mb-6">
            <nav className="text-gray-600">
              <span className="mx-2">/</span>
              <Link to="/cm-cns" className="text-blue-500"> Data Pemeliharaan Mingguan CNS</Link>
              <span className="mx-2">/</span>
              <span>Detail Catatan Mingguan</span>
            </nav>
        </div>

    <div className="p-8">
      <div className="bg-white shadow-md rounded p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-center mb-4">Catatan Mingguan CNS</h2>
        <div className="space-y-2">
          <p><strong>Tanggal:</strong> {laporan.tanggal}</p>
          <p><strong>Jam Selesai:</strong> {laporan.jamSelesai}</p>
          <p><strong>Peralatan:</strong> {laporan.peralatan}</p>
          <p><strong>Aktivitas:</strong> {laporan.aktivitas}</p>
          <p><strong>Teknisi:</strong> {laporan.teknisi}</p>
          <p><strong>Note:</strong> {laporan.note || "-"}</p>
          {laporan.bukti && (
            <div>
              <strong>Paraf:</strong>
              <img src={laporan.bukti} alt="Paraf" className="w-32 mt-2" />
            </div>
          )}
        </div>
        <div className="mt-6 text-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handlePrintPDF}
          >
            Cetak PDF
          </button>
        </div>
      </div>
    </div>
    <footer className="text-center py-4">
        <p className="text-black">Air Nav Manado</p>
    </footer>
    </div>
  );
};

export default CMCnsSinglePDF;
