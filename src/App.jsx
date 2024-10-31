import React from 'react';
import './App.css';
import Navigation from './Component/Nav/Navigation';
import CatatanMingguan from './Pages/catatan/catatanmingguan';

function App() {
  return (
    <div className="flex">
      <Navigation />
      <div className="flex-1">
        <CatatanMingguan />
      </div>
    </div>
  );
}

export default App;
