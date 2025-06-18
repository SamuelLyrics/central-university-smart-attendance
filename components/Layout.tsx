import React, { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    // Optional: Add a full-page loading spinner here if desired
    return (
        <div className="min-h-screen flex items-center justify-center bg-university-light-gray">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-university-blue"></div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-university-light-gray">
      {/* Add your desktop navigation/header here */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
