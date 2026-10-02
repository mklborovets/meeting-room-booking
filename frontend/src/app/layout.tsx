import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/providers/StoreProvider';
import AuthProvider from '@/components/AuthProvider';
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
        <html lang="en">
            <body className={inter.className}>
                <StoreProvider>

                    <AuthProvider>
                        <div className="min-h-screen bg-gray-50">
                            <Navbar />
                            {children}
                        </div>
                    </AuthProvider>
                    <Toaster position="top-right" />
                </StoreProvider>
            </body>
        </html>
    );
}