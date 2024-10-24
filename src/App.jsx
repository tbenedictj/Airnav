import React, { useState } from 'react';
import './App.css';
import Sidebar, { SidebarContext } from './Component/Sidebar/Sidebar';
import Header from './Component/Header/Header';
import CatatanMingguan from './Pages/catatan/catatanmingguan';

function App() {
  const [expanded, setExpanded] = useState(true); // Pastikan ini ada

  return (
    <div className="flex">
      <SidebarContext.Provider value={{ expanded, setExpanded }}>
        <Sidebar />
        <div className="flex-1">
          <Header />
          <CatatanMingguan />
        </div>
      </SidebarContext.Provider>
    </div>
  );
}

export default App;
