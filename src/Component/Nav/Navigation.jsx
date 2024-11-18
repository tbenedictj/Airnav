import React, { useState } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

export default function Navigation({ onToggle }) {
  const [expanded, setExpanded] = useState(true);

  const handleSidebarToggle = (expanded) => {
    setExpanded(expanded);
    if (onToggle) {
      onToggle(expanded);
    }
  };

  return (
    <div className="app-container">
      <Sidebar onToggle={handleSidebarToggle} />
      <Header expanded={expanded} />
    </div>
  );
}