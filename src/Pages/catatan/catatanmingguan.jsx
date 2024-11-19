import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import './catatan.css';

const CatatanMingguan = () => {
    return (
        <div className="catatan-container">
            <h1 className="page-title">List Data Pemeliharaan Mingguan CNS</h1>
            <div className="content-card">
                <h2 className="card-header">Pemeliharaan Mingguan CNS</h2>
                
                <div className="action-buttons">
                    <div className="left-actions">
                        <button className="btn btn-primary">
                            <FontAwesomeIcon icon={faPlus} /> Tambah Data
                        </button>
                        <button className="btn btn-secondary">
                            <FontAwesomeIcon icon={faFilter} /> Filter & Print PDF
                        </button>
                    </div>
                    <div className="right-actions">
                        <label>Show</label>
                        <select className="entries-select">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                            <option>100</option>
                        </select>
                        <span>entries</span>
                    </div>
                </div>

                <div className="action-buttons">
                    <div></div>
                    <div className="search-container">
                        <label>Search:</label>
                        <input type="text" className="search-box" />
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    </div>
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Tanggal / Jam</th>
                                <th>Alat</th>
                                <th>Kegiatan</th>
                                <th>Teknisi</th>
                                <th>Note</th>
                                <th>Paraf</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2024-07-31 08:00:00 - 2024-07-31 08:30:00</td>
                                <td>DME MWB</td>
                                <td>
                                    - Pemeliharaan rutin... <br />
                                    <a href="#" className="link-text">Selengkapnya</a>
                                </td>
                                <td>DEIVI TUMIIR <br /> ALLAN LENGKONG</td>
                                <td>Normal ops</td>
                                <td>
                                    <img src="https://placehold.co/20x20" alt="Paraf" className="signature-img" />
                                </td>
                                <td className="action-cell">
                                    <button className="btn-edit">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button className="btn-delete">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>2024-07-31 08:00:00 - 2024-07-31 08:30:00</td>
                                <td>DVOR MWB</td>
                                <td>
                                    - Pemeliharaan rutin... <br />
                                    <a href="#" className="link-text">Selengkapnya</a>
                                </td>
                                <td>DEIVI TUMIIR <br /> ALLAN LENGKONG</td>
                                <td>Normal ops</td>
                                <td>
                                    <img src="https://placehold.co/20x20" alt="Paraf" className="signature-img" />
                                </td>
                                <td className="action-cell">
                                    <button className="btn-edit">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button className="btn-delete">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600">Showing 1 to 10 of 28 entries</p>
                        <div className="flex space-x-2">
                            <button className="btn btn-secondary">Previous</button>
                            <button className="btn btn-primary">1</button>
                            <button className="btn btn-secondary">2</button>
                            <button className="btn btn-secondary">3</button>
                            <button className="btn btn-secondary">Next</button>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="text-center py-4">
                <p className="text-gray-600">Air Nav Manado</p>
            </footer>
        </div>
    );
};

export default CatatanMingguan;
