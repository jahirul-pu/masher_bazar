import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Masik Bazar (মাসিক বাজার) — Your Whole Month’s Market. In One Order.',
  description:
    'The household grocery operating system for Bangladesh. Generate personalized monthly baskets, optimize your household budget, lock commodity prices, and save up to 15% on bulk procurement.',
  keywords: [
    'Masik Bazar',
    'Monthly grocery Bangladesh',
    'Dhaka grocery subscription',
    'মাসিক বাজার',
    'Bulk rice dal oil Dhaka',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="scroll-smooth">
      <body className="min-h-screen flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}
