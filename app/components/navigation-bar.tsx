'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { logOut, isGuest } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Close menu on route change for better UX
  React.useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
    
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };

  const navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/mapview', label: 'MapView' },
    { href: '/search', label: 'Search' },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#2d323c]/70 backdrop-blur-lg border border-white/10 px-6 py-3 rounded-full flex items-center gap-6 shadow-md">
        {/* Logo */}
        <Link
          href="/"
          className="text-white text-lg font-bold whitespace-nowrap"
          style={{ fontFamily: '"Boldonse", system-ui, sans-serif' }}
        >
          CineSky
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm px-4 py-1.5 rounded-full transition-all ${
                isActive(link.href)
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User Actions */}
        <div className="ml-auto hidden md:flex items-center gap-3">
          {isGuest ? (
            <>
              <span className="text-white/60 text-sm">Guest Mode</span>
              <Link 
                href="/login" 
                className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-5 py-2 rounded-full transition-all whitespace-nowrap"
              >
                Sign In
              </Link>
            </>
          ) : (
            <button
              onClick={logOut}
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-5 py-2 rounded-full transition-all whitespace-nowrap"
            >
              Log Out
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-3 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all relative"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navbar-menu"
          onClick={toggleMenu}
        >
          {/* Hamburger/X animation */}
          <span className="block w-6 h-6 relative">
            <span
              className={`absolute left-0 top-1 w-6 h-0.5 bg-white rounded transition-transform duration-300 ${isMenuOpen ? 'rotate-45 top-3' : ''}`}
            />
            <span
              className={`absolute left-0 top-3 w-6 h-0.5 bg-white rounded transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`absolute left-0 top-5 w-6 h-0.5 bg-white rounded transition-transform duration-300 ${isMenuOpen ? '-rotate-45 top-3' : ''}`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-navbar-menu"
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-modal="true"
        role="dialog"
        tabIndex={-1}
        onClick={closeMenu}
        onKeyDown={e => {
          if (e.key === 'Escape') closeMenu();
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" aria-hidden="true" />
        <nav
          className={`fixed bottom-0 left-0 right-0 md:top-0 md:right-0 md:w-64 w-full h-2/3 md:h-full bg-[#1C1D22]/95 backdrop-blur-2xl text-white p-8 flex flex-col gap-6 shadow-2xl rounded-t-3xl md:rounded-none transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'
          }`}
          style={{ maxWidth: 340 }}
          onClick={e => e.stopPropagation()}
        >
          <button
            className="self-end mb-4 p-3 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={closeMenu}
              className={`text-lg font-medium px-6 py-3 rounded-full transition-all block ${
                isActive(link.href)
                  ? 'bg-white/10 text-white font-semibold shadow'
                  : 'text-white/70 hover:text-white/90'
              }`}
              style={{ minHeight: 48 }}
            >
              {link.label}
            </Link>
          ))}
          {isGuest ? (
            <Link
              href="/login"
              onClick={closeMenu}
              tabIndex={isMenuOpen ? 0 : -1}
              className="mt-auto bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-center font-semibold shadow whitespace-nowrap"
              style={{ minHeight: 48 }}
            >
              Sign In
            </Link>
          ) : (
            <button
              onClick={() => {
                logOut();
                closeMenu();
              }}
              tabIndex={isMenuOpen ? 0 : -1}
              className="mt-auto bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-center font-semibold shadow whitespace-nowrap"
              style={{ minHeight: 48 }}
            >
              Log Out
            </button>
          )}
        </nav>
      </div>
    </>
  );
}
