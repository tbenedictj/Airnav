import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { format } from 'date-fns';

const MtCNS = () => {
  const [openReports, setOpenReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    const fetchOpenReports = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create query for open status reports
        const reportsQuery = query(
          collection(db, "LaporanCNS"),
          where("status", "==", "open")
        );

        const querySnapshot = await getDocs(reportsQuery);
        const reports = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort by date in descending order
        reports.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
        
        setOpenReports(reports);
      } catch (err) {
        console.error("Error fetching open reports:", err);
        setError("Failed to load maintenance reports");
      } finally {
        setLoading(false);
      }
    };

    fetchOpenReports();
  }, []);

  const toggleRowExpansion = (id) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Open Maintenance Reports - CNS</h1>
      
      {openReports.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No open maintenance reports found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Equipment</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Technician</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Activities</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {openReports.map((report) => (
                <React.Fragment key={report.id}>
                  <tr 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleRowExpansion(report.id)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {format(new Date(report.tanggal), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {report.peralatan}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {Array.isArray(report.teknisi) 
                        ? report.teknisi.join(', ')
                        : report.teknisi}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {expandedRows.has(report.id) 
                        ? report.aktivitas
                        : `${report.aktivitas?.substring(0, 50)}${report.aktivitas?.length > 50 ? '...' : ''}`}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {report.status}
                      </span>
                    </td>
                  </tr>
                  {expandedRows.has(report.id) && (
                    <tr>
                      <td colSpan="5" className="px-4 py-3 bg-gray-50">
                        <div className="text-sm text-gray-900">
                          <p className="font-semibold">Full Activities:</p>
                          <p className="whitespace-pre-wrap">{report.aktivitas}</p>
                          {report.buktiUrl && (
                            <div className="mt-2">
                              <p className="font-semibold">Evidence:</p>
                              <img 
                                src={report.buktiUrl} 
                                alt="Maintenance Evidence" 
                                className="max-w-md mt-2 rounded-lg shadow"
                              />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MtCNS;
