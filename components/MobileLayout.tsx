import React from 'react';

const MobileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-2 bg-white min-h-screen">
    {/* Example: a simple mobile nav bar */}
    <nav className="fixed bottom-0 left-0 right-0 bg-university-blue text-white flex justify-around py-2 z-50">
      <button>Home</button>
      <button>Attendance</button>
      <button>Profile</button>
    </nav>
    <div className="pb-16">{children}</div>
  </div>
);

export default MobileLayout;