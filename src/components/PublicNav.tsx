'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, HeartHandshake } from 'lucide-react';

export default function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="public-nav">
      <div className="nav-inner">
        {/* Logo with Vector Icon */}
        <Link href="/" className="nav-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: 'var(--teal-500)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeartHandshake size={18} />
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            with <span style={{ color: 'var(--teal-500)' }}>you</span>
          </span>
        </Link>

        {/* Desktop links - Visible on laptop & desktop */}
        <ul className="nav-links nav-links-desktop">
          <li><Link href="/#how-it-works" className="nav-link">How It Works</Link></li>
          <li><Link href="/#services" className="nav-link">Services</Link></li>
          <li><Link href="/pricing" className="nav-link">Pricing</Link></li>
          <li><Link href="/safety" className="nav-link">Safety</Link></li>
          <li><Link href="/faq" className="nav-link">FAQ</Link></li>
          <li style={{ marginLeft: '0.5rem' }}>
            <Link href="/login" className="btn btn-outline btn-sm">Login</Link>
          </li>
          <li>
            <Link href="/register/member" className="btn btn-primary btn-sm">Get Started</Link>
          </li>
        </ul>

        {/* Mobile hamburger - Strictly hidden on desktop/laptop */}
        <button
          className="btn btn-ghost btn-sm mobile-menu-btn"
          id="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{ display: 'none' }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          style={{
            background: 'white',
            borderTop: '1px solid var(--border)',
            padding: '1.25rem 1.5rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          }}
        >
          <Link href="/#how-it-works" className="nav-link" onClick={() => setMobileOpen(false)}>How It Works</Link>
          <Link href="/#services" className="nav-link" onClick={() => setMobileOpen(false)}>Services</Link>
          <Link href="/pricing" className="nav-link" onClick={() => setMobileOpen(false)}>Pricing</Link>
          <Link href="/safety" className="nav-link" onClick={() => setMobileOpen(false)}>Safety</Link>
          <Link href="/faq" className="nav-link" onClick={() => setMobileOpen(false)}>FAQ</Link>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <Link href="/login" className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }} onClick={() => setMobileOpen(false)}>Login</Link>
            <Link href="/register/member" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }} onClick={() => setMobileOpen(false)}>Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
