import React, { useState, createContext, useContext } from 'react';
import logo from "../../assets/Icon/logo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import {
  LifeBuoy, Receipt, Boxes, Package, CircleUser, ChartColumn, LayoutDashboard, Settings
} from "lucide-react";
import '../../App.css';

export const NavigationContext = createContext({
  expanded: true,
  setExpanded: () => {}
});

function SidebarItem({ icon, text }) {
  const { expanded } = useContext(NavigationContext);

  return (
    <li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group hover:bg-indigo-50 text-gray-600`}>
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
      {!expanded && (
        <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
          {text}
        </div>
      )}
    </li>
  );
}

export default function Navigation() {
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <NavigationContext.Provider value={{ expanded, setExpanded }}>
      <aside className={`fixed top-0 h-screen transition-all bg-white border-r shadow-sm ${expanded ? 'w-40' : 'w-16'} sidebar`}>
        <nav className="h-full flex flex-col">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img src={logo} className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`} alt="Logo"/>
            <button onClick={toggleSidebar} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>
          <ul className="flex-1 px-3">
            <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" />
            <SidebarItem icon={<ChartColumn size={20} />} text="Statistics" />
            <SidebarItem icon={<CircleUser size={20} />} text="Users" />
            <SidebarItem icon={<Boxes size={20} />} text="Inventory" />
            <SidebarItem icon={<Package size={20} />} text="Orders" />
            <SidebarItem icon={<Receipt size={20} />} text="Billings" />
            <hr className="my-3" />
            <SidebarItem icon={<Settings size={20} />} text="Settings" />
            <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
          </ul>
        </nav>
      </aside>
      
      <div className={`fixed top-0 z-10 w-full bg-white shadow-sm transition-all duration-300 ${expanded ? 'pl-40' : 'pl-16'} header`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="text-gray-500">Thursday, 17 October 2024</div>
            <div className="flex items-center space-x-4">
              <div className="text-gray-500">
                Selamat Bekerja, <span className="font-bold text-gray-700">Dinas Pagi</span>
              </div>
              <div className="border-l h-6 border-gray-300 mx-4"></div>
              <div className="flex items-center text-gray-500">
                <span>admin</span>
                <FontAwesomeIcon icon={faUser} className="ml-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavigationContext.Provider>
  );
}
