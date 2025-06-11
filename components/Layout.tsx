
import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    // Optional: Add a full-page loading spinner here if desired
    return (
        <div className="min-h-screen flex items-center justify-center bg-university-light-gray">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-university-blue"></div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-university-light-gray">
      <Header />
      <div className="flex flex-1 pt-2">
        {currentUser && <Sidebar />}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto ${!currentUser ? 'w-full' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
