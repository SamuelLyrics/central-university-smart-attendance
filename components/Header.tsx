
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { APP_NAME } from '../constants';
import Button from './Button';
import LogoutIcon from './icons/LogoutIcon';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-university-blue text-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl sm:text-2xl font-bold hover:text-university-gold transition-colors">
          {APP_NAME}
        </Link>
        {currentUser && (
          <div className="flex items-center space-x-4">
            <div className="text-sm text-right">
              <p className="font-medium">{currentUser.username}</p>
              <p className="text-xs text-gray-300">{currentUser.role}</p>
            </div>
            <Button
              onClick={logout}
              variant="secondary"
              size="sm"
              leftIcon={<LogoutIcon className="h-4 w-4" />}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
