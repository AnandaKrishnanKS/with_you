'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Search,
  CalendarDays,
  MessageCircle,
  CreditCard,
  UserCircle,
  Shield,
  LogOut,
  Bell,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const SIDEBAR_ITEMS = [
  { href: '/app/member/home', label: 'Home', icon: Home },
  { href: '/app/member/explore', label: 'Explore', icon: Search },
  { href: '/app/member/bookings', label: 'Bookings', icon: CalendarDays },
  { href: '/app/member/messages', label: 'Messages', icon: MessageCircle },
  { href: '/app/member/payments', label: 'Payments', icon: CreditCard },
  { href: '/app/member/profile', label: 'Profile', icon: UserCircle },
  { href: '/app/member/safety', label: 'Safety', icon: Shield },
];

const MOBILE_BOTTOM_ITEMS = [
  { href: '/app/member/home', label: 'Home', icon: Home },
  { href: '/app/member/explore', label: 'Explore', icon: Search },
  { href: '/app/member/bookings', label: 'Bookings', icon: CalendarDays },
  { href: '/app/member/messages', label: 'Messages', icon: MessageCircle },
  { href: '/app/member/profile', label: 'Profile', icon: UserCircle },
];

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', headers: { Accept: 'application/json' } });
    window.location.href = '/login';
  }

  return (
    <div className="dashboard-layout">
      {/* Mobile Top Header */}
      <div
        style={{
          display: 'none',
          background: 'white',
          borderBottom: '1px solid var(--border)',
          padding: '0.75rem 1.25rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 60,
        }}
        className="mobile-top-bar"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link href="/app/member/home" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              with <span style={{ color: 'var(--teal-500)' }}>you</span>
            </span>
          </Link>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--teal-600)',
              background: 'var(--teal-50)',
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
            }}
          >
            MEMBER
          </span>
        </div>

        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#334155',
            padding: '0.25rem',
          }}
          id="mobile-drawer-btn"
          aria-label="Toggle drawer"
        >
          {mobileDrawerOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Extra Drawer Menu */}
      {mobileDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: '3.75rem 0 0 0',
            background: 'white',
            zIndex: 55,
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            overflowY: 'auto',
          }}
          className="mobile-drawer-panel"
        >
          {SIDEBAR_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileDrawerOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: pathname === href ? 'var(--teal-700)' : 'var(--text-secondary)',
                background: pathname === href ? 'var(--teal-50)' : '#f8fafc',
                textDecoration: 'none',
              }}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#ef4444',
                background: '#fef2f2',
                border: 'none',
                cursor: 'pointer',
              }}
              id="mobile-drawer-logout"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              with <span style={{ color: 'var(--teal-500)' }}>you</span>
            </span>
          </Link>
          <div
            style={{
              marginTop: '0.5rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--teal-600)',
              background: 'var(--teal-50)',
              display: 'inline-block',
              padding: '0.15rem 0.6rem',
              borderRadius: '100px',
              letterSpacing: '0.05em',
            }}
          >
            MEMBER
          </div>
        </div>

        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`sidebar-item ${pathname === href ? 'active' : ''}`}
            >
              <Icon className="icon" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border)' }}>
          <button className="sidebar-item" onClick={handleLogout} style={{ color: '#ef4444' }} id="member-logout">
            <LogOut className="icon" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {MOBILE_BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`bottom-nav-item ${pathname === href ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
