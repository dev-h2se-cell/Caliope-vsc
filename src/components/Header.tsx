
'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Button } from './ui/button';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart } from 'lucide-react';
import { Badge } from './ui/badge';
import { UserAuthSection } from './UserAuthSection';
import { ThemeToggleButton } from './ThemeToggleButton';


export function Header() {
  const { items } = useCart();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center py-2">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Logo />
            </Link>
            <nav className="hidden md:flex gap-4">
              <Button asChild variant="ghost">
                <Link href="/services">Servicios</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/catalog">Productos</Link>
              </Button>
               <Button asChild variant="ghost">
                <Link href="/memberships">Membresías</Link>
              </Button>
               <Button asChild variant="ghost">
                <Link href="/concierge">Asistente</Link>
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <Button asChild variant="ghost" size="icon" className="relative">
                <Link href="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                        <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0">{totalItems}</Badge>
                    )}
                     <span className="sr-only">Carrito de compras</span>
                </Link>
            </Button>
            <UserAuthSection />
          </div>
        </div>
    </header>
  );
}
