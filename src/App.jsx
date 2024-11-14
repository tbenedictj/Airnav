import React from 'react';
import './App.css';
import Teknisi from './Pages/Teknisi/Teknisi';
import LoginForm from './Pages/Login/LoginForm';

function App() {
  return (
    <div className="flex">
      <LoginForm />
      <div className="flex-1 main-content">
      </div>
    </div>
  );
}

export default App;
