/** @jsxImportSource react */
import React, { useState, FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import { APP_NAME } from '../constants';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const user = await login(username, password);
    if (user) {
      navigate('/');
    } else {
      setError('Invalid username or password.');
    }
  };

  if (currentUser && !isLoading) {
    return <Navigate to="/" replace />;
  }
  
  if (isLoading && !currentUser) { // Show loading only if not already logged in and navigating away
    return (
      <div className="min-h-screen flex items-center justify-center bg-university-light-gray">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-university-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-university-blue to-university-blue-light p-4">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <img src="https://picsum.photos/seed/uni_logo/100/100" alt="University Logo" className="mx-auto h-16 w-16 rounded-full mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-university-blue">{APP_NAME}</h1>
          <p className="text-gray-600 mt-1">Please sign in to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="username"
            label="Username (Email)"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g., lecturer@uni.edu"
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;