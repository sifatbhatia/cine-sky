'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { logOut } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

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

        {/* Logout */}
        <button
          onClick={logOut}
          className="ml-auto hidden md:inline-block bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-5 py-2 rounded-full transition-all"
        >
          Log Out
        </button>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-white" onClick={toggleMenu}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div
          className={`absolute top-0 right-0 w-64 h-full bg-[#1C1D22]/90 backdrop-blur-lg text-white p-6 flex flex-col gap-6 shadow-lg transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="self-end text-white" onClick={closeMenu}>
            <svg
              width="24"
              height="24"
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
              onClick={closeMenu}
              className={`text-base font-medium px-4 py-2 rounded-full transition-all ${
                isActive(link.href)
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={() => {
              logOut();
              closeMenu();
            }}
            className="mt-auto bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full"
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
