
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from '@/hooks/use-cart';
import { AuthProvider } from '@/hooks/use-auth';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Lexend } from 'next/font/google';
import { ToastProvider } from '@/hooks/use-toast';

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

export const metadata: Metadata = {
  title: 'Caliope - Tu Curador de Bienestar',
  description: 'Tu guía de bienestar personalizada',
  icons: {
    icon: '/favicon%20caliope.svg',
  },
};

import { ThemeProvider } from '@/components/ThemeProvider';

// ... (imports existentes)

// ... (fuente y metadata)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${lexend.variable} font-body antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </AuthProvider>
            <WhatsAppButton />
            <Toaster />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
