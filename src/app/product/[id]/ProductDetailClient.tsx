'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ShoppingCart, Loader2, Zap } from 'lucide-react';

import type { Product } from '@/lib/types';
import useAuth from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';

import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import { Badge } from '@/components/ui/badge';

// This is the Client Component. It receives data from its parent (the Server Component).
export function ProductDetailClient({ product }: { product: Product | null }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const { addItem } = useCart();
    
    useEffect(() => {
        if (!product) {
            router.push('/catalog');
        }
    }, [product, router]);

    // Handle authentication loading and redirection
    useEffect(() => {
        if (!loading && !user) {
            toast({
                title: 'Acción requerida',
                description: 'Por favor, inicia sesión o regístrate para ver los detalles del producto.',
                variant: 'destructive',
            });
            router.push('/login');
        }
    }, [user, loading, router, toast]);

    if (!product) {
        return null;
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.inStock) {
            addItem(product);
            toast({
                title: 'Producto añadido',
                description: `${product.name} ha sido añadido a tu carrito.`,
            });
        }
    };
    
    const handleQuickBuy = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.inStock) {
            addItem(product);
            toast({
                title: 'Redirigiendo al carrito',
                description: 'Completa tu compra.',
            });
            router.push('/cart');
        }
    };

    // While authenticating, show a loader
    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    // Once authentication is complete and user is present, render the full detail page.
    return (
        <>
            <Link href="/catalog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Volver al catálogo
            </Link>

            <div className="bg-card rounded-lg shadow-lg overflow-hidden">
                <div className="relative w-full h-64 md:h-80">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        data-ai-hint={product.aiHint}
                    />
                </div>
                <div className="p-6 md:p-8">
                    <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                    <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-2">{product.name}</h1>
                    <div className="mb-6">
                        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                    </div>
                    <p className="text-base text-card-foreground/90 mb-6">{product.description}</p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between my-8 p-4 bg-secondary/50 rounded-lg gap-4">
                        <p className="text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
                        <div className="flex items-center gap-2">
                             <Button size="lg" variant="outline" disabled={!product.inStock} onClick={handleAddToCart}>
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Agregar al carrito
                            </Button>
                            <Button size="lg" disabled={!product.inStock} onClick={handleQuickBuy}>
                                <Zap className="mr-2 h-5 w-5"/>
                                Compra Rápida
                            </Button>
                        </div>
                    </div>

                    {!product.inStock && (
                        <div className="text-center p-4 bg-yellow-100 text-yellow-800 rounded-md">
                            Este producto está actualmente agotado.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
