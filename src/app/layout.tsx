import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GIA Deliksari Semarang - Growing Church',
  description:
    'Website Resmi Gereja Isa Almasih (GIA) Deliksari Semarang. Menghadirkan warta jemaat terkini, jadwal ibadah (COC Kidz, Grow Generation Youth, Hana Fellowship, Ibadah Raya), serta portal administrasi gereja.',
  keywords: [
    'GIA Deliksari',
    'Gereja Isa Almasih Deliksari Semarang',
    'Growing Church Semarang',
    'Ps Yohanes Sutono',
    'Grow Generation PRBK',
    'COC Kidz',
    'Ibadah Semarang',
  ],
  authors: [{ name: 'GIA Deliksari Creative Media' }],
  openGraph: {
    title: 'GIA Deliksari Semarang - Growing Church!',
    description: 'Gereja Isa Almasih Deliksari Semarang - Tempat Persekutuan, Pertumbuhan Iman, dan Penjangkauan Jiwa.',
    url: 'https://giadeliksarisemarang.org',
    siteName: 'GIA Deliksari Semarang',
    images: [
      {
        url: '/images/hero-church.jpg',
        width: 1200,
        height: 630,
        alt: 'GIA Deliksari Semarang',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
