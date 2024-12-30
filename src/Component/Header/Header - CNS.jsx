import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import '../../App.css';

export default function Header({ expanded }) {
  const [currentDate, setCurrentDate] = useState('');
  const [currentShift, setCurrentShift] = useState('');

  const determineShift = (hours) => {
    if (hours >= 7 && hours < 13) {
      return 'Dinas Pagi';
    } else if (hours >= 13 && hours < 19) {
      return 'Dinas Siang';
    } else {
      return 'Dinas Malam';
    }
  };

  useEffect(() => {
    const fetchCurrentTime = async () => {
      try {
        const response = await fetch('http://worldtimeapi.org/api/timezone/Asia/Jakarta');
        const data = await response.json();
        const date = new Date(data.datetime);
        const options = { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          timeZone: 'Asia/Jakarta'
        };
        const formattedDate = date.toLocaleDateString('en-US', options);
        setCurrentDate(formattedDate);
        setCurrentShift(determineShift(date.getHours()));
      } catch (error) {
        console.error('Error fetching time:', error);
        const date = new Date();
        const options = { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        };
        setCurrentDate(date.toLocaleDateString('en-US', options));
        setCurrentShift(determineShift(date.getHours()));
      }
    };

    fetchCurrentTime();
    const interval = setInterval(fetchCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`header ${!expanded ? 'collapsed' : ''}`} style={{ left: expanded ? '16rem' : '4rem' }}>
      <div className="flex items-center justify-end p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-black">
              {currentDate}
            </div>
          </div>
          <div className="border-l h-6 border-gray-300 mx-4"></div>
          <div className="text-black">
            Selamat Bekerja, <span className="font-bold text-black">{currentShift}</span>
          </div>
          <div className="border-l h-6 border-gray-300 mx-4"></div>
          <div className="flex items-center text-black">
            <span>CNS</span>
            <FontAwesomeIcon icon={faUser} className="ml-2" />
          </div>
        </div>
      </div>
    </header>
  );
}
