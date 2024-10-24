// Sidebar.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faTachometerAlt, faFolder, faUser, faUserPlus, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
  return (
    <div className="bg-blue-600 h-screen w-64 text-white flex flex-col items-start p-4">
      {/* Logo Section */}
      <div className="flex items-center mb-8">
        <FontAwesomeIcon icon={faPlane} className="text-3xl mr-2" />
        <div>
          <h1 className="text-xl font-bold">AIRNAV</h1>
          <h2 className="text-xl font-bold">MANADO</h2>
        </div>
      </div>

      <div className="w-full border-b border-blue-400 mb-4"></div>

      {/* Menu Items */}
      <div className="flex items-center mb-4">
        <FontAwesomeIcon icon={faTachometerAlt} className="text-lg mr-2" />
        <span className="text-lg">Dashboard</span>
      </div>

      <div className="text-blue-300 text-sm mb-2">LOGBOOK</div>

      <div className="flex items-center mb-4">
        <FontAwesomeIcon icon={faFolder} className="text-lg mr-2" />
        <span className="text-lg">CNS</span>
        <FontAwesomeIcon icon={faChevronRight} className="ml-auto" />
      </div>

      <div className="flex items-center mb-4">
        <FontAwesomeIcon icon={faFolder} className="text-lg mr-2" />
        <span className="text-lg">Support</span>
        <FontAwesomeIcon icon={faChevronRight} className="ml-auto" />
      </div>

      <div className="flex items-center mb-4">
        <FontAwesomeIcon icon={faUser} className="text-lg mr-2" />
        <span className="text-lg">Teknisi</span>
      </div>

      <div className="flex items-center mb-4">
        <FontAwesomeIcon icon={faUserPlus} className="text-lg mr-2" />
        <span className="text-lg">Tambahkan User</span>
      </div>

      {/* Collapse Button */}
      <div className="mt-auto mb-4">
        <div className="bg-blue-500 rounded-full p-2">
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
      </div>
    </div>
  );
}
