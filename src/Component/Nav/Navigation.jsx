import React, { useState, createContext, useContext, useEffect } from 'react';
import logo from "../../assets/background/logo4.jpg";
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

function SidebarItem({ icon, text, active }) {
  const { expanded } = useContext(NavigationContext);

  return (
    <li className={`nav-item ${active ? 'active' : ''}`}>
      <div className="nav-icon">{icon}</div>
      <span className={`nav-text overflow-hidden transition-all ${expanded ? "opacity-100 w-32" : "opacity-0 w-0"}`}>
        {text}
      </span>
      {!expanded && (
        <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-white text-gray-700 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 shadow-lg">
          {text}
        </div>
      )}
    </li>
  );
}

export default function Navigation({ onToggle }) {
  const [expanded, setExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [currentDate, setCurrentDate] = useState('');
  const [currentShift, setCurrentShift] = useState('');

  const determineShift = (hours) => {
    if (hours >= 7 && hours < 13) {
      return 'Dinas Pagi';
    } else if (hours >= 13 && hours < 19) {
      return 'Dinas Siang';
    } else {
      return 'Dinas Malam';
    }
  };

  useEffect(() => {
    const fetchCurrentTime = async () => {
      try {
        // Using Asia/Jakarta timezone for Indonesia
        const response = await fetch('http://worldtimeapi.org/api/timezone/Asia/Jakarta');
        const data = await response.json();
        
        // Convert the datetime to a Date object
        const date = new Date(data.datetime);
        
        // Format the date
        const options = { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          timeZone: 'Asia/Jakarta'
        };
        
        const formattedDate = date.toLocaleDateString('en-US', options);
        setCurrentDate(formattedDate);

        // Set current shift based on hours
        const hours = date.getHours();
        setCurrentShift(determineShift(hours));
      } catch (error) {
        console.error('Error fetching time:', error);
        // Fallback to local date if API fails
        const date = new Date();
        const options = { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        };
        setCurrentDate(date.toLocaleDateString('en-US', options));
        setCurrentShift(determineShift(date.getHours()));
      }
    };

    // Fetch time immediately
    fetchCurrentTime();

    // Update time every minute
    const interval = setInterval(fetchCurrentTime, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (onToggle) {
      onToggle(newExpanded);
    }
  };

  return (
    <NavigationContext.Provider value={{ expanded, setExpanded }}>
      <aside className={`sidebar ${!expanded ? 'collapsed' : ''}`}>
        <nav className="h-full flex flex-col">
          <div className="p-4 pb-2 flex justify-between items-center border-b border-gray-200">
            <img src={logo} className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`} alt="Logo"/>
            <button 
              onClick={toggleSidebar} 
              className="p-1.5 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>
          <ul className="flex-1 px-3 py-4 space-y-1">
            <SidebarItem 
              icon={<LayoutDashboard size={20} />} 
              text="Dashboard" 
              active={activeItem === 'Dashboard'}
            />
            <SidebarItem 
              icon={<ChartColumn size={20} />} 
              text="Statistics" 
              active={activeItem === 'Statistics'}
            />
            <SidebarItem 
              icon={<CircleUser size={20} />} 
              text="Users" 
              active={activeItem === 'Users'}
            />
            <SidebarItem 
              icon={<Boxes size={20} />} 
              text="Inventory" 
              active={activeItem === 'Inventory'}
            />
            <SidebarItem 
              icon={<Package size={20} />} 
              text="Orders" 
              active={activeItem === 'Orders'}
            />
            <SidebarItem 
              icon={<Receipt size={20} />} 
              text="Billings" 
              active={activeItem === 'Billings'}
            />
            <hr className="my-3 border-gray-200" />
            <SidebarItem 
              icon={<Settings size={20} />} 
              text="Settings" 
              active={activeItem === 'Settings'}
            />
            <SidebarItem 
              icon={<LifeBuoy size={20} />} 
              text="Help" 
              active={activeItem === 'Help'}
            />
          </ul>
        </nav>
      </aside>
      
      <header className={`header ${!expanded ? 'collapsed' : ''}`} style={{ left: expanded ? '16rem' : '4rem' }}>
        <div className="flex items-center justify-end p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-black">
                {currentDate}
              </div>
            </div>
            <div className="border-l h-6 border-gray-300 mx-4"></div>
            <div className="text-black">
              Selamat Bekerja, <span className="font-bold text-black">{currentShift}</span>
            </div>
            <div className="border-l h-6 border-gray-300 mx-4"></div>
            <div className="flex items-center text-black">
              <span>admin</span>
              <FontAwesomeIcon icon={faUser} className="ml-2" />
            </div>
          </div>
        </div>
      </header>
    </NavigationContext.Provider>
  );
}
