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

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
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
        <div className="form-container">
          <div className="heading">
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
              <button type="submit" className="login-button">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
