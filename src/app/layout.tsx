import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProfileCheck - Advanced People Search Platform',
  description: 'Find anyone, anywhere with our AI-powered people search platform. Get detailed profiles, verification badges, and insights from multiple trusted sources.',
  keywords: 'people search, profile verification, background check, contact finder, social media search',
  authors: [{ name: 'ProfileCheck Team' }],
  openGraph: {
    title: 'ProfileCheck - Advanced People Search Platform',
    description: 'Find anyone, anywhere with our AI-powered people search platform.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProfileCheck - Advanced People Search Platform',
    description: 'Find anyone, anywhere with our AI-powered people search platform.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}