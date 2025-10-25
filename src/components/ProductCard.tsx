
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import { ShoppingCart, Zap } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function ProductCard({ product }: { product: Product }) {
    const { addItem } = useCart();
    const { toast } = useToast();
    const router = useRouter();
    
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

    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="h-full flex flex-col"
        >
            <Card className="flex flex-col h-full overflow-hidden transition-shadow hover:shadow-xl group">
                <Link href={`/product/${product.id}`} className="flex flex-col flex-grow">
                    <div className="relative w-full h-48">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            data-ai-hint={product.aiHint}
                        />
                        {!product.inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">AGOTADO</span>
                            </div>
                        )}
                    </div>
                    <CardHeader>
                        <p className="text-sm font-semibold text-primary">{product.category}</p>
                        <CardTitle className="text-lg font-headline">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
                        <div className="flex items-center justify-between">
                            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                            <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
                        </div>
                    </CardContent>
                </Link>
                <CardFooter className="bg-slate-50/50 pt-4 mt-auto flex-col gap-2">
                     <Button className="w-full" disabled={!product.inStock} onClick={handleAddToCart}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {product.inStock ? 'Añadir al carrito' : 'No disponible'}
                    </Button>
                    <Button className="w-full" variant="secondary" disabled={!product.inStock} onClick={handleQuickBuy}>
                        <Zap className="mr-2 h-4 w-4" />
                        Compra Rápida
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

