import React, { useState, useEffect } from 'react';
import bg1 from '../../assets/background/mb1.jpg';
import bg2 from '../../assets/background/mb2.jpg';
import bg3 from '../../assets/background/mb3.jpg';
import bg4 from '../../assets/background/mb4.jpg';
import bg5 from '../../assets/background/of1.jpg';
import logo from '../../assets/background/airnav.png';
import echain from '../../assets/background/echain.png';
import lasimi from '../../assets/background/lasimi.png';
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
        transition: 'background-image 1s ease',
      }}
    >

      {/* Container diperbesar */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 1)',
          padding: '60px',
          borderRadius: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '90%', // Lebar diperbesar
          margin: '20px auto',
          marginTop: '20px',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
          gap: '50px', // Jarak antar gambar
        }}
      >
        {[
          { href: '/dashboard', img: logo, alt: 'E-Logbook', label: 'E-Logbook' },
          { href: 'https://lasimi.airnavindonesia.co.id/', img: lasimi, alt: 'Lasimi', label: 'Lasimi' },
          { href: 'https://e-chain.airnavindonesia.co.id/', img: echain, alt: 'E-Chain', label: 'E-Chain' },
        ].map(({ href, img, alt, label }, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '1 0 200px',
              textAlign: 'center',
            }}
          >
            <a href={href} rel="noopener noreferrer">
              <img
                src={img}
                alt={alt}
                onClick={() => handleSetBackground(img)}
                style={{
                  cursor: 'pointer',
                  width: '200px', // Gambar lebih besar
                  height: '200px',
                  objectFit: 'contain',
                  marginBottom: '15px',
                  transition: 'transform 0.3s, opacity 0.3s',
                  transform: 'scale(1)',
                  opacity: 0.9,
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.opacity = '0.9';
                }}
              />
            </a>
            <div
              style={{
                color: 'white', // Warna putih
                fontSize: '1.5em',
                fontWeight: 'bold', // Bold
                textShadow: '2px 2px 6px rgba(0, 0, 0, 0.9)', // Shadow
                lineHeight: '1.5',
                minHeight: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
