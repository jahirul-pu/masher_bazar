import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Masher Bazar (মাসের বাজার) — Operations, WMS & Procurement Control Center',
  description: 'Enterprise operations back-office for Masher Bazar Bangladesh.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {children}
      </body>
    </html>
  );
}
