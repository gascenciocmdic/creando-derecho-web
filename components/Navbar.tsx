'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar({ contactEmail }: { contactEmail: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div>
              <span className="text-snow font-playfair font-bold text-lg tracking-wide group-hover:text-gold transition-colors">
                Creando Derecho
              </span>
              <span className="hidden sm:block text-oxford-light text-xs tracking-widest uppercase">
                Consultores
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#quienes-somos" className="text-snow/75 hover:text-gold text-sm font-montserrat font-medium tracking-wide transition-colors">
              Quiénes Somos
            </a>
            <a href="#servicios" className="text-snow/75 hover:text-gold text-sm font-montserrat font-medium tracking-wide transition-colors">
              Servicios
            </a>
            <a href={`mailto:${contactEmail}`} className="text-snow/75 hover:text-gold text-sm font-montserrat font-medium tracking-wide transition-colors">
              Contacto
            </a>
            <Link href="/triage" className="btn-primary text-sm">
              Consulta Gratuita
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-snow p-2"
            aria-label="Abrir menú"
            id="mobile-menu-toggle"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy border-t border-white/5">
          <div className="px-4 py-4 space-y-3">
            <a href="#quienes-somos" onClick={() => setMenuOpen(false)} className="block text-snow/75 hover:text-gold text-sm font-medium py-2 transition-colors">
              Quiénes Somos
            </a>
            <a href="#servicios" onClick={() => setMenuOpen(false)} className="block text-snow/75 hover:text-gold text-sm font-medium py-2 transition-colors">
              Servicios
            </a>
            <a href={`mailto:${contactEmail}`} onClick={() => setMenuOpen(false)} className="block text-snow/75 hover:text-gold text-sm font-medium py-2 transition-colors">
              Contacto
            </a>
            <Link href="/triage" onClick={() => setMenuOpen(false)} className="btn-primary text-sm w-full justify-center mt-2">
              Consulta Gratuita
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
