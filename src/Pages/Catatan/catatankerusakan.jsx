import React from 'react';

const LaporanKerusakan = () => {
    const data = [
        {
            date: "2024-08-18 16:00:00 sampai 2024-09-15 07:44:00",
            alat: "AC Split 2 PK Daikin Kanan (MM)",
            kegiatan: "Pada saat ..",
            teknisi: "WISNU H. BIMANYU TUNAS T. MADA",
            status: "Normal Ops",
            paraf: "https://placehold.co/50x50",
        },
        {
            date: "2024-09-23 15:15:00 sampai 2024-09-24 18:00:00",
            alat: "Elevator/Lift Schindler (Tower)",
            kegiatan: "Lift berop..",
            teknisi: "DAVID KHARISMA. N EVAN H SIPAYUNG WISNU H. BIMANYU",
            status: "Normal Ops",
            paraf: "https://placehold.co/50x50",
        },
        // Tambahkan data lainnya di sini
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-black">List Laporan Kerusakan</h1>
            <div className="bg-white p-4 rounded shadow">
                <div className="flex justify-between mb-4">
                    <div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2">
                            Tambah Data
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                            Filter & Print PDF
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
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr className="text-black">
                            <th className="py-2 px-4 border-b">Tanggal / Jam</th>
                            <th className="py-2 px-4 border-b">Alat</th>
                            <th className="py-2 px-4 border-b">Kegiatan</th>
                            <th className="py-2 px-4 border-b">Teknisi</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Paraf</th>
                            <th className="py-2 px-4 border-b">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} className="text-black">
                                <td className="py-2 px-4 border-b">{item.date}</td>
                                <td className="py-2 px-4 border-b">{item.alat}</td>
                                <td className="py-2 px-4 border-b">
                                    {item.kegiatan}{' '}
                                    <a href="#" className="text-blue-600">
                                        Selengkapnya
                                    </a>
                                </td>
                                <td className="py-2 px-4 border-b">{item.teknisi}</td>
                                <td className="py-2 px-4 border-b">
                                    <span
                                        className={`px-2 py-1 rounded ${
                                            item.status === 'Normal Ops'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-red-500 text-white'
                                        }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <img
                                        src={item.paraf}
                                        alt="Paraf"
                                        className="w-8 h-8"
                                    />
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <button className="text-blue-500 mr-2">
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="text-red-500 mr-2">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                    <button className="text-green-500">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <footer className="text-center py-4">
                <p className="text-black">Manado Air Nav</p>
            </footer>
        </div>
    );
};

export default LaporanKerusakan;
