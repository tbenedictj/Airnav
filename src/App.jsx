import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginForm from './Pages/Login/LoginForm';
import CatatanHarian from './Pages/catatan/catatanharian';
import TambahCatatan from './Pages/catatan/TambahCatatan';
import Navigation from './Component/Nav/Navigation';
import LogoutButton from './Component/LogoutButton/LogoutButton';
import { AuthProvider, useAuth } from './config/AuthContext';

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleSidebarToggle = (expanded) => {
    setIsSidebarExpanded(expanded);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <CatatanHarian />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/tambah-catatan"
            element={
              <PrivateRoute>
                <div className="app-container">
                  <Navigation onToggle={handleSidebarToggle} />
                  <main className={`main-content ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                    <TambahCatatan />
                  </main>
                </div>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
