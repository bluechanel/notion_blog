import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://wileyzhang.com'),
  title: {
    template: '%s | Wiley Blog',
    default: 'Wiley Blog | AI/LLM developer blog'
  },
  description: 'A technical blog focusing on AI, LLM development, and cutting-edge technology insights. Sharing practical experiences and in-depth analysis in artificial intelligence and large language models.',
  keywords: ['AI', 'LLM', 'Machine Learning', 'Artificial Intelligence', 'Developer Blog', 'Technical Writing', 'Programming'],
  authors: [{ name: 'Wiley Zhang' }],
  creator: 'Wiley Zhang',
  publisher: 'Wiley Zhang',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wileyzhang.com',
    title: 'Wiley Blog | AI/LLM developer blog',
    description: 'A technical blog focusing on AI, LLM development, and cutting-edge technology insights. Sharing practical experiences and in-depth analysis in artificial intelligence and large language models.',
    siteName: 'Wiley Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wiley Blog | AI/LLM developer blog',
    description: 'A technical blog focusing on AI, LLM development, and cutting-edge technology insights. Sharing practical experiences and in-depth analysis in artificial intelligence and large language models.',
    creator: '@wileyzhang',
  },
  alternates: {
    canonical: 'https://wileyzhang.com',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
