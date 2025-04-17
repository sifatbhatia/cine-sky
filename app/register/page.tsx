'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, signUp } = useAuth();

  // ✅ Redirect to /home if already logged in
  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setError('');
      setLoading(true);
      await signUp(email, password, email.split('@')[0]);
      router.push('/home');
    } catch {
      setError('Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1 className="auth-title">CineSky</h1>
        <p className="auth-subtitle">Register</p>
      </div>

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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Re-type Password</label>
          <input
            id="confirm-password"
            type="password"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          Sign Up →
        </button>
        <button
          type="button"
          className="auth-button bg-white text-[#e43c1c] border border-[#e43c1c] mt-2 hover:bg-[#f4e3e0]"
          onClick={() => router.push('/home')}
        >
          Continue as Guest
        </button>

        <div className="auth-footer">
          have an account? <Link href="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
