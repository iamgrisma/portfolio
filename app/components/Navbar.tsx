"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-strong shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg font-[var(--font-heading)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              KB
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-white tracking-wide font-[var(--font-heading)]">Kamal Baral</h1>
              <p className="text-[10px] text-dark-200 uppercase tracking-[0.2em]">Vet Technician</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'text-accent-400'
                      : 'text-dark-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-accent-500 rounded-full" />
                  )}
                </Link>
              );
            })}
            <Link
              href="/login"
              className="ml-4 px-4 py-2 text-sm font-medium rounded-lg text-dark-200 hover:text-white transition-colors"
            >
              Admin
            </Link>
            <Link
              href="/contact?tab=booking"
              className="ml-2 px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-accent-500 to-teal-500 text-white hover:shadow-lg hover:shadow-accent-500/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Book Appointment
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${
          isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="glass-strong border-t border-white/5 px-6 py-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-accent-400 bg-accent-500/10'
                    : 'text-dark-100 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact?tab=booking"
            className="block text-center mt-3 px-4 py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-accent-500 to-teal-500 text-white"
          >
            Book Appointment
          </Link>
          <Link
            href="/login"
            className="block text-center mt-2 px-4 py-3 rounded-lg text-sm font-medium text-dark-200 hover:text-white bg-white/5"
          >
            Admin Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
