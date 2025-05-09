'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const router = useRouter();
  const { signIn, continueAsGuest } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoginError('');
      setLoading(true);
      await signIn(email, password);
      router.push('/home');
    } catch (error) {
      setLoginError('Failed to sign in');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setLoading(true);
    continueAsGuest();
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1 className="auth-title">CineSky</h1>
        <p className="auth-subtitle">Welcome Back</p>
        <p className="auth-subtitle">Sign in to your acc</p>
      </div>

      {loginError && <div className="error-message">{loginError}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="password">Password</label>
            <Link href="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          Sign In →
        </button>

        <div className="auth-footer">
          Don&apos;t have an account? <Link href="/register">Sign up</Link>
        </div>
      </form>

      <div className="mt-6 w-full max-w-[400px]">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#1d0811] text-white/60">or</span>
          </div>
        </div>
        
        <button
          onClick={handleGuestLogin}
          disabled={loading}
          className="mt-6 w-full py-4 px-6 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
} 