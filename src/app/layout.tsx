import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: '%s | With You',
    default: 'With You — Platonic Companionship & Support in Kerala',
  },
  description:
    'With You connects you with verified, compassionate supporters for platonic companionship, emotional support, and practical assistance across Kerala.',
  keywords: ['companionship', 'support', 'Kerala', 'emotional support', 'elder care', 'platonic'],
  openGraph: {
    title: 'With You — Platonic Companionship & Support',
    description: 'Verified, compassionate supporters for companionship and practical help.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
