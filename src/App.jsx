import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginForm from './Pages/Login/LoginForm';
import CHCNS from './Pages/catatan/CNS/CH-CNS';
import CHSup from './Pages/catatan/Support/CH-Sup';
import CMCNS from './Pages/catatan/CNS/CM-CNS';
import CMSup from './Pages/catatan/Support/CM-Sup';
import CBCNS from './Pages/catatan/CNS/CB-CNS';
import CBSup from './Pages/catatan/Support/CB-Sup';
import LKCNS from './Pages/catatan/CNS/LK-CNS';
import LKSup from './Pages/catatan/Support/LK-Sup';
import TambahLKCNS from './Pages/catatan/CNS/TambahLK-CNS';
import TambahLKSup from './Pages/catatan/Support/TambahLK-Sup';
import TambahCHCNS from './Pages/catatan/CNS/TambahCH-CNS';
import TambahCHSup from './Pages/catatan/Support/TambahCHSup';
import TambahCMCNS from './Pages/catatan/CNS/TambahCM-CNS';
import TambahCMSup from './Pages/catatan/Support/TambahCMSup';
import TambahCBsup from './Pages/catatan/Support/TambahCBSup';
import Tambahcbcns from './Pages/catatan/CNS/TambahCB-CNS';
import Navigation from './Component/Nav/Navigation';
import EditTeknisi from './Pages/Teknisi/EditTeknisi/EditTeknisi';
import { AuthProvider, useAuth } from './config/AuthContext';
import PeralatanCNS from './Pages/Alat/CNS/PeralatanCNS';
import PeralatanSup from './Pages/Alat/Support/PeralatanSup';
import Teknisi from './Pages/Teknisi/Teknisi';
import Menu from './Pages/Menu/menu';
import TambahAlatCNS from './Pages/Alat/CNS/TambahAlatCNS';
import TambahAlatSup from './Pages/Alat/Support/TambahAlatSupport';
import AddTeknisi from './Pages/Teknisi/TambahTeknisi/TambahTeknisi';
import Dashboard from './Pages/Dashboard/dashboard';
import EditAlatCNS from './Pages/Alat/CNS/EditAlatCNS';
import EditAlatSup from './Pages/Alat/Support/EditAlatSup';
import EditCHCNS from './Pages/catatan/CNS/EditCatatanCNS/EditCH-CNS';
import EditCMCNS from './Pages/catatan/CNS/EditCatatanCNS/EditCM-CNS';
import EditLKCNS from './Pages/catatan/CNS/EditCatatanCNS/EditLK-CNS';
import EditCBCNS from './Pages/catatan/CNS/EditCatatanCNS/EditCB-CNS';
import EditLKSup from './Pages/catatan/Support/EditCatatanSup/EditLK-Sup';
import EditCHSup from './Pages/catatan/Support/EditCatatanSup/EditCH-Sup';
import EditCMSup from './Pages/catatan/Support/EditCatatanSup/EditCM-Sup';
import EditCBSup from './Pages/catatan/Support/EditCatatanSup/EditCB-Sup';
import MtCNS from "./Pages/Dashboard/MtCNS";
import MtSup from "./Pages/Dashboard/MtSup";
import PrivateRoute from './config/PrivateRoute';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleSidebarToggle = (expanded) => {
    setIsSidebarExpanded(expanded);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route for login */}
          <Route path="/loginform" element={<LoginForm />} />
          
          {/* Protected routes */}
          <Route path="/menu" element={
            <PrivateRoute>
              <Menu />
            </PrivateRoute>
          } />
          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <Dashboard />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/lk-cns"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <LKCNS />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/ch-cns"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <CHCNS />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/ch-sup"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <CHSup />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/cm-cns"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <CMCNS />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/cm-sup"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <CMSup />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/cb-cns"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <CBCNS />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/cb-sup"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <CBSup />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/lk-sup"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <LKSup />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/tambah-lk"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <TambahLKCNS />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/tambah-lk-sup"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <TambahLKSup />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/tambah-ch-cns"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <TambahCHCNS />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/tambah-ch-sup"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <TambahCHSup />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/tambah-cm-cns"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <TambahCMCNS />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/tambah-cm-sup"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <TambahCMSup />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/tambah-cb-cns"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <Tambahcbcns />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/tambah-cb-sup"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <TambahCBsup />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/peralatan-cns"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <PeralatanCNS />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/peralatan-sup"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <PeralatanSup />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/teknisi"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <Teknisi />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/tambah-teknisi"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <AddTeknisi />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/tambah-alat-cns"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <TambahAlatCNS />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/tambah-alat-support"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <TambahAlatSup />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-teknisi/:id"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <EditTeknisi />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-alat-cns/:id"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <EditAlatCNS />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-alat-sup/:id"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <EditAlatSup />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-ch-cns/:id"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <EditCHCNS />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-cm-cns/:id"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <EditCMCNS />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-cb-cns/:id"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <EditCBCNS />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-lk-cns/:id"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <EditLKCNS />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-lk-sup/:id"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <EditLKSup />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-ch-sup/:id"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <EditCHSup />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-cm-sup/:id"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <EditCMSup />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-cb-sup/:id"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <EditCBSup />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/mtcns"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <MtCNS />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/mtsup"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <MtSup />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          
          {/* Default routes */}
          <Route path="/" element={<Navigate to="/loginform" replace />} />
          <Route path="*" element={<Navigate to="/loginform" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
