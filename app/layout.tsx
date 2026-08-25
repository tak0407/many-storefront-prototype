import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://many-local-prototype.tak9447.chatgpt.site'),
  title: 'MANY Local · OKDAM Korean Kitchen',
  description: 'A multilingual local storefront prototype for independent Korean businesses.',
  openGraph: {
    title: 'MANY Local',
    description: 'A multilingual storefront for independent Korean businesses.',
    type: 'website',
    images: [{ url: '/og.png', width: 1728, height: 910, alt: 'MANY Local multilingual storefront' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MANY Local',
    description: 'A multilingual storefront for independent Korean businesses.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
