// src/components/LoginForm.js
import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import bg1 from '../../assets/background/mb1.jpg';
import bg2 from '../../assets/background/mb2.jpg';
import bg3 from '../../assets/background/mb3.jpg';
import bg4 from '../../assets/background/mb4.jpg';
import bg5 from '../../assets/background/of1.jpg';
import logo from '../../assets/background/logo1.jpg';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [slideIndex, setSlideIndex] = useState(0);
  const slides = [bg1, bg2, bg3, bg4, bg5];

  // Mengatur timeout untuk logout setelah 5 menit tidak ada aktivitas
  useEffect(() => {
    const timeout = 300000; // 5 menit dalam milidetik
    let timer = setTimeout(() => {
      window.location.href = 'https://teknikairnavmanado.com/Login/logout';
    }, timeout);

    const resetTimeout = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        window.location.href = 'https://teknikairnavmanado.com/Login/logout';
      }, timeout);
    };

    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keypress', resetTimeout);
    window.addEventListener('click', resetTimeout);
    window.addEventListener('scroll', resetTimeout);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keypress', resetTimeout);
      window.removeEventListener('click', resetTimeout);
      window.removeEventListener('scroll', resetTimeout);
    };
  }, []);

  // Mengatur slideshow background
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Ganti gambar setiap 5 detik
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lakukan aksi login, misalnya panggil API
    console.log('Username:', username);
    console.log('Password:', password);
    // Implementasikan logika autentikasi sesuai kebutuhan
  };

  return (
    <div className="login-page">
      <div className="slideshow">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt={`Background ${index + 1}`}
            className={slideIndex === index ? 'active' : ''}
          />
        ))}
      </div>
      <div className="blur-background"></div>
      <div className="container">
        <div className="heading">
          <button className="cta">
            <span>Sign In</span>
            <svg width="15px" height="10px" viewBox="0 0 13 10">
              <path d="M1,5 L11,5"></path>
              <polyline points="8 1 12 5 8 9"></polyline>
            </svg>
          </button>
          <img src={logo} alt="AirNav_Logo" className="logo" />
        </div>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              className="input"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              name="password"
              className="input"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="login-button" type="submit">
              Login
            </button>
          </form>
        </div>
        <div className="agreement">
          <a href="#">Teknik Airnav Cabang Manado</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
