import React, { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/background/logo4.jpg";
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../App.css';

export const SidebarContext = createContext({
  expanded: true,
  setExpanded: () => {}
});

function SidebarItem({ icon, text, active, onClick, hasSubmenu, isSubmenuOpen, submenuItems, className }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <div className={className}>
      <li 
        className={`nav-item ${active ? 'active' : ''} ${hasSubmenu ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <div className="nav-icon">{icon}</div>
        <span className={`nav-text overflow-hidden transition-all ${expanded ? "opacity-100 w-32" : "opacity-0 w-0"}`}>
          {text}
        </span>
        {hasSubmenu && expanded && (
          <div className="ml-auto">
            {isSubmenuOpen ? <i className="fas fa-chevron-up text-sm" /> : <i className="fas fa-chevron-down text-sm" />}
          </div>
        )}
        {!expanded && (
          <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-white text-gray-700 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 shadow-lg">
            {text}
          </div>
        )}
      </li>
      {hasSubmenu && isSubmenuOpen && expanded && (
        <ul className="ml-8 space-y-1">
          {submenuItems.map((item, index) => (
            <li key={index} className="text-sm py-2 text-gray-700 hover:text-blue-600 cursor-pointer">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Sidebar({ onToggle }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState('');
  const [cnsSubmenuOpen, setCnsSubmenuOpen] = useState(false);
  const [supportSubmenuOpen, setSupportSubmenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCnsSubmenuItemClick = (path) => {
    navigate(path);
    setActiveItem('CNS');
  };

  const handleSupportSubmenuItemClick = (path) => {
    navigate(path);
    setActiveItem('Support');
  };

  const cnsSubmenuItems = [
    <div onClick={() => handleCnsSubmenuItemClick('/lk-cns')}>Laporan Kegiatan & Kerusakan</div>,
    <div onClick={() => handleCnsSubmenuItemClick('/ch-cns')}>Pemeliharaan Harian</div>,
    <div onClick={() => handleCnsSubmenuItemClick('/cm-cns')}>Pemeliharaan Mingguan</div>,
    <div onClick={() => handleCnsSubmenuItemClick('/cb-cns')}>Pemeliharaan Bulanan</div>,
    <div onClick={() => handleCnsSubmenuItemClick('/peralatan-cns')}>Peralatan</div>
  ];

  const supportSubmenuItems = [
    <div onClick={() => handleSupportSubmenuItemClick('/lk-sup')}>Laporan Kegiatan & Kerusakan</div>,
    <div onClick={() => handleSupportSubmenuItemClick('/ch-sup')}>Pemeliharaan Harian</div>,
    <div onClick={() => handleSupportSubmenuItemClick('/cm-sup')}>Pemeliharaan Mingguan</div>,
    <div onClick={() => handleSupportSubmenuItemClick('/cb-sup')}>Pemeliharaan Bulanan</div>,
    <div onClick={() => handleSupportSubmenuItemClick('/peralatan-sup')}>Peralatan</div>
  ];

  const toggleSidebar = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (onToggle) {
      onToggle(newExpanded);
    }
  };

  const handleCnsClick = () => {
    setCnsSubmenuOpen(!cnsSubmenuOpen);
    setActiveItem('CNS');
  };

  const handleSupportClick = () => {
    setSupportSubmenuOpen(!supportSubmenuOpen);
    setActiveItem('Support');
  };

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      <aside className={`sidebar ${!expanded ? 'collapsed' : ''}`}>
        <nav className="h-full flex flex-col">
          <div className="p-4 pb-2 flex justify-between items-center border-b border-gray-200">
            <img src={logo} className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`} alt="Logo"/>
            <button 
              onClick={toggleSidebar} 
              className="p-1.5 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              {expanded ? <i className="fas fa-chevron-left" /> : <i className="fas fa-chevron-right" />}
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <ul className="flex-1 px-3 py-4 space-y-1">
              <SidebarItem 
                icon={<i className="fas fa-th-large text-lg" />}
                text="Dashboard" 
                active={activeItem === 'Dashboard'}
                onClick={() => setActiveItem('Dashboard')}
              />
              <SidebarItem 
                icon={<i className="fas fa-broadcast-tower text-lg" />}
                text="CNS" 
                active={activeItem === 'CNS'}
                hasSubmenu={true}
                isSubmenuOpen={cnsSubmenuOpen}
                submenuItems={cnsSubmenuItems}
                onClick={handleCnsClick}
              />
              <SidebarItem 
                icon={<i className="fas fa-life-ring text-lg" />}
                text="Support" 
                active={activeItem === 'Support'}
                hasSubmenu={true}
                isSubmenuOpen={supportSubmenuOpen}
                submenuItems={supportSubmenuItems}
                onClick={handleSupportClick}
              />
              <SidebarItem 
                icon={<i className="fas fa-users text-lg" />}
                text="Teknisi" 
                active={activeItem === 'Teknisi'}
                onClick={() => {
                  setActiveItem('Teknisi');
                  navigate('/teknisi');
                }}
              />
              <SidebarItem 
                icon={<i className="fas fa-user-plus text-lg" />}
                text="Tambah Teknisi" 
                active={activeItem === 'TambahTeknisi'}
                onClick={() => {
                  setActiveItem('TambahTeknisi');
                  navigate('/tambah-teknisi');
                }}
              />
            </ul>
            
            <div className="mt-auto px-3 py-4 border-t border-gray-200">
              <SidebarItem 
                icon={<i className="fas fa-sign-out-alt text-lg" />}
                text="Logout" 
                onClick={handleLogout}
                className="hover:text-red-600"
              />
            </div>
          </div>
        </nav>
      </aside>
    </SidebarContext.Provider>
  );
}
