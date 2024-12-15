import React, { useState, useEffect } from 'react';
import bg1 from '../../assets/background/mb1.jpg';
import bg2 from '../../assets/background/mb2.jpg';
import bg3 from '../../assets/background/mb3.jpg';
import bg4 from '../../assets/background/mb4.jpg';
import bg5 from '../../assets/background/of1.jpg';
import logo from '../../assets/background/airnav.png';
import './menu.css';

const slides = [bg1, bg2, bg3, bg4, bg5];

const ImageContainer = () => {
  const [background, setBackground] = useState(slides[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setBackground(slides[index]);
  }, [index]);

  const handleSetBackground = (bg) => {
    setBackground(bg);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        color: 'white',
        transition: 'background-image 1s ease',
      }}
    >
      <h1
        style={{
          fontSize: '3em',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
          fontWeight: 'bold',
          margin: 0,
          padding: 0,
        }}
      >
        Selamat Datang
      </h1>

      {/* Container dengan opacity untuk 3 logo */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur',
          padding: '40px',
          borderRadius: '20px',
          display: 'flex',
          gridTemplateColumns: 'repeat(auto-fit), minmax(200px, 2fr))',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '80%',
          margin: '20px auto',
          marginTop: '20px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          gap: '20px',
        }}
      >
        {[ 
          { href: '/dashboard', img: bg1, alt: 'E-Logbook', label: 'E-Logbook' },
          { href: 'https://lasimi.airnavindonesia.co.id/', img: bg2, alt: 'Lasimi', label: 'Lasimi' },
          { href: 'https://e-chain.airnavindonesia.co.id/', img: bg3, alt: 'E-Chain', label: 'E-Chain' },
        ].map(({ href, img, alt, label }, idx) => (
          <div key={idx} style={{ flex: '1 0 200px', textAlign: 'center' }}>
            <a href={href} rel="noopener noreferrer">
              <img
                src={logo}
                alt={alt}
                onClick={() => handleSetBackground(img)}
                style={{
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '200px',
                  height: 'auto',
                  background: 'transparent',
                  border: 'none',
                  transition: 'transform 0.3s, opacity 0.3s',
                  transform: 'scale(1)',
                  opacity: 0.8,
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.opacity = '0.8';
                }}
              />
            </a>
            <div
              style={{
                color: '#ffffff',
                fontSize: '1.2em',
                marginTop: '10px',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 9.9)'
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageContainer;
