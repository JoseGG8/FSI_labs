import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'eBookStore — Tienda Digital de Libros Electrónicos',
  description:
    'E-commerce full-stack de eBooks con control de stock en servidor, pagos PayPal Sandbox y seguimiento de envíos digitales en tiempo real.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
