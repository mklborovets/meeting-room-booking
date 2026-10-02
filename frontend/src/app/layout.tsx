import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/providers/StoreProvider';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Meeting Room Booking',
    description: 'Manage and book meeting rooms efficiently',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                <StoreProvider>
                    <AuthGuard>
                        <div className="min-h-screen bg-gray-50">
                            <Navbar />
                            {children}
                        </div>
                    </AuthGuard>
                    <Toaster position="top-right" />
                </StoreProvider>
            </body>
        </html>
    );
}