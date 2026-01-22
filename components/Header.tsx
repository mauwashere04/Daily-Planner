
import React from 'react';

const Header: React.FC = () => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Daily Planner</h1>
          <p className="text-blue-100 mt-1 opacity-90">{today}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
          <i className="fas fa-calendar-check text-2xl"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
