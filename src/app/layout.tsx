import type { Metadata } from 'next';
import { Outfit, Oswald, Playfair_Display, Dancing_Script, Urbanist, Gilda_Display } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { AskAiLauncher } from '@/components/ai/AskAiLauncher';

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const gilda = Gilda_Display({
  subsets: ['latin'],
  variable: '--font-gilda',
  display: 'swap',
  weight: ['400'],
});

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
      className={`${urbanist.variable} ${gilda.variable} ${outfit.variable} ${oswald.variable} ${playfair.variable} ${cursive.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('prospera-theme')||localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);document.documentElement.dataset.theme=t;}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased bg-[#0a0d12] text-[#e7eaf0]">
        <ToastProvider>
          <div className="app-shell">
            {children}
          </div>
          <AskAiLauncher />
        </ToastProvider>
      </body>
    </html>
  );
}
