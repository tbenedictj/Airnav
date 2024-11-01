import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { SidebarContext } from '../Sidebar/Sidebar'; // Pastikan path ini benar sesuai struktur folder Anda
import '../../App.css'; // Pastikan path ini benar sesuai struktur folder Anda

export default function Header() {
  const { expanded, setExpanded } = useContext(SidebarContext); // Menggunakan context untuk mendapatkan state 'expanded' dan fungsi 'setExpanded'

  // Fungsi untuk toggle state 'expanded' pada sidebar
  const toggleSidebar = () => {
    setExpanded(!expanded); // Mengubah state 'expanded'
  };

  return (
    <div className={expanded ? "header" : "header-collapsed"}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="text-gray-600 mr-4">
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className="text-gray-500">Thursday, 17 October 2024</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-gray-500">
            Selamat Bekerja, <span className="font-bold text-gray-700">Dinas Pagi</span>
          </div>
          <div className="border-l h-6 border-gray-300"></div>
          <div className="flex items-center text-gray-500">
            <span>admin</span>
            <FontAwesomeIcon icon={faUser} className="ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
