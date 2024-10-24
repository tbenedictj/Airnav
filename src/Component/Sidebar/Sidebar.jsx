// Sidebar.jsx
import React, { useContext, createContext, useState } from 'react';
import logo from "../../assets/Icon/logo.svg";
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import {
  LifeBuoy,
  Receipt,
  Boxes,
  Package,
  CircleUser,
  ChartColumn,
  LayoutDashboard,
  Settings
} from "lucide-react";
import '../../App.css';

export const SidebarContext = createContext({
  expanded: true, // Nilai default
  setExpanded: () => {} // Fungsi kosong sebagai placeholder
});

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);  // State untuk mengatur expand/collapse sidebar
  
  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      <aside
        className={`fixed top-0 h-screen transition-all bg-white border-r shadow-sm ${
          expanded ? 'w-40' : 'w-16'
        }`}
      >
        <nav className="h-full flex flex-col">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src={logo}
              className={`overflow-hidden transition-all ${
                expanded ? "w-32" : "w-0"
              }`}
              alt="Logo"
            />
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
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

          <div className="border-t flex p-3">
            <img
              src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
              alt="User Avatar"
              className="w-10 h-10 rounded-md"
            />
            <div
              className={`
                flex justify-between items-center
                overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
              `}
            >
              <div className="leading-4">
                <h4 className="font-semibold">John Doe</h4>
                <span className="text-xs text-gray-600">johndoe@gmail.com</span>
              </div>
              <MoreVertical size={20} />
            </div>
          </div>
        </nav>
      </aside>
    </SidebarContext.Provider>
  );
}

function SidebarItem({ icon, text }) {
  const { expanded } = useContext(SidebarContext);  // Menggunakan context untuk menampilkan icon/text
  
  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        hover:bg-indigo-50 text-gray-600
      `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
