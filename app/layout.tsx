import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bếp Hỗn Loạn - Trò Chơi Nấu Ăn Phối Hợp 3D',
  description: 'Trò chơi nấu ăn phối hợp 3D vui nhộn dành cho 1-8 người chơi trực tuyến ngay trên trình duyệt di động và máy tính.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#212121',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-[#212121] text-[#ececec] font-sans antialiased overflow-x-hidden min-h-dvh flex flex-col">
        {children}
      </body>
    </html>
  );
}
