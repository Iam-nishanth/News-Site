import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import AuthProvider from '@/Providers/AuthProvider';

export const metadata: Metadata = {
    title: 'Hard Yards',
    description: ''
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <AuthProvider>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <main className="relative flex flex-col min-h-screen">
                            <div className="flex-grow flex-1">
                                {children}
                                <Toaster closeButton richColors position="top-right" />
                            </div>
                        </main>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
