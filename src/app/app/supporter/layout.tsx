'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Inbox,
  CalendarDays,
  MessageCircle,
  DollarSign,
  UserCircle,
  Settings,
  Shield,
  LogOut,
  ToggleLeft,
  ToggleRight,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const SIDEBAR_ITEMS = [
  { href: '/app/supporter/home', label: 'Home', icon: Home },
  { href: '/app/supporter/requests', label: 'Requests', icon: Inbox },
  { href: '/app/supporter/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/app/supporter/messages', label: 'Messages', icon: MessageCircle },
  { href: '/app/supporter/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/app/supporter/profile', label: 'Profile', icon: UserCircle },
  { href: '/app/supporter/preferences', label: 'Preferences', icon: Settings },
];

const MOBILE_BOTTOM_ITEMS = [
  { href: '/app/supporter/home', label: 'Home', icon: Home },
  { href: '/app/supporter/requests', label: 'Requests', icon: Inbox },
  { href: '/app/supporter/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/app/supporter/messages', label: 'Messages', icon: MessageCircle },
  { href: '/app/supporter/profile', label: 'Profile', icon: UserCircle },
];

export default function SupporterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [online, setOnline] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', headers: { Accept: 'application/json' } });
    window.location.href = '/login';
  }

  async function toggleOnline() {
    setOnline(!online);
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
          <Link href="/app/supporter/home" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              with <span style={{ color: 'var(--teal-500)' }}>you</span>
            </span>
          </Link>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#92400e',
              background: '#fef9c3',
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
            }}
          >
            SUPPORTER
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={toggleOnline}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: online ? '#f0fdf4' : '#f1f5f9',
              border: `1px solid ${online ? '#bbf7d0' : '#cbd5e1'}`,
              borderRadius: '999px',
              padding: '0.2rem 0.5rem',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: online ? '#166534' : '#64748b',
            }}
          >
            {online ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
            {online ? 'Online' : 'Offline'}
          </button>

          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#334155',
              padding: '0.25rem',
            }}
            id="supporter-mobile-drawer-btn"
            aria-label="Toggle drawer"
          >
            {mobileDrawerOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Panel */}
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
              id="supporter-mobile-drawer-logout"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
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
              color: '#92400e',
              background: '#fef9c3',
              display: 'inline-block',
              padding: '0.15rem 0.6rem',
              borderRadius: '100px',
              letterSpacing: '0.05em',
            }}
          >
            SUPPORTER
          </div>

          {/* Online toggle */}
          <button
            onClick={toggleOnline}
            id="availability-toggle"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.75rem',
              background: online ? 'var(--teal-50)' : 'var(--neutral-100)',
              border: `1px solid ${online ? 'var(--teal-200)' : 'var(--border)'}`,
              borderRadius: '100px',
              padding: '0.35rem 0.75rem',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: online ? 'var(--teal-700)' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}
          >
            {online ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            {online ? 'Online' : 'Offline'}
          </button>
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

        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border)' }}>
          <button className="sidebar-item" onClick={handleLogout} style={{ color: '#ef4444' }} id="supporter-logout">
            <LogOut className="icon" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">{children}</main>

      {/* Mobile bottom nav with Profile */}
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
