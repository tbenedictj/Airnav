import React, { useState } from 'react';
import './App.css';
import Teknisi from './Pages/Teknisi/Teknisi';
import LoginForm from './Pages/Login/LoginForm';
import CatatanHarian from './Pages/catatan/catatanharian';
import Navigation from './Component/Nav/Navigation';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleSidebarToggle = (expanded) => {
    setIsSidebarExpanded(expanded);
  };

  return (
    <div className="app-container">
      <Navigation onToggle={handleSidebarToggle} />
      <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
        <CatatanHarian />
      </main>
    </div>
  );
}

export default App;
