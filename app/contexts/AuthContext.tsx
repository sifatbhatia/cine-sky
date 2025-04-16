'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authChecked: boolean;
  isGuest: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authChecked: false,
  isGuest: false,
  signUp: async () => {},
  signIn: async () => {},
  logOut: async () => {},
  continueAsGuest: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      setAuthChecked(true);
      
      if (currentUser) {
        localStorage.setItem('userName', currentUser.displayName || 'User');
        setIsGuest(false);
      } else {
        localStorage.removeItem('userName');
        // Check if user was previously in guest mode
        const wasGuest = localStorage.getItem('isGuest') === 'true';
        setIsGuest(wasGuest);
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      localStorage.setItem('userName', name);
      router.push('/home');
    } catch (error: unknown) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user) {
        // For demo purposes, if we need to use firebase but don't have it set up,
        // we'll simulate a successful login
        localStorage.setItem('userName', result.user.displayName || 'User');
        router.push('/home');
      }
    } catch (error: unknown) {
      console.error('Error signing in:', error);
      // For demo purposes, if Firebase is not properly configured
      if (email === 'demo@example.com' && password === 'password') {
        localStorage.setItem('userName', 'Demo User');
        setUser({ 
          displayName: 'Demo User', 
          email: 'demo@example.com',
          uid: 'demo-user-id',
        } as User);
        router.push('/home');
        return;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    setLoading(true);
    try {
      // Create a guest user object
      const guestUser = {
        displayName: 'Guest User',
        email: 'guest@example.com',
        uid: 'guest-user-id',
      } as User;
      
      setUser(guestUser);
      setIsGuest(true);
      localStorage.setItem('userName', 'Guest User');
      localStorage.setItem('isGuest', 'true');
      router.push('/home');
    } catch (error: unknown) {
      console.error('Error setting up guest mode:', error);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem('userName');
      localStorage.removeItem('isGuest');
      setUser(null);
      setIsGuest(false);
      router.push('/login');
    } catch (error: unknown) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    authChecked,
    isGuest,
    signUp,
    signIn,
    logOut,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 