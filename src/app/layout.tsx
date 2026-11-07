import type { Metadata } from 'next';
import { Outfit, Oswald, Playfair_Display, Dancing_Script } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const cursive = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-cursive',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Prospera AI — AI Luxury Real Estate Deal Room & Client Portal',
  description:
    'A Next-Generation, AI-Powered Luxury Real Estate Deal Room & Customer Portal. Automated lead qualification, real-time negotiation pipelines, and autonomous concierge matching.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${oswald.variable} ${playfair.variable} ${cursive.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased bg-[#0a0d12] text-[#e7eaf0]">
        <ToastProvider>
          <div className="app-shell">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
