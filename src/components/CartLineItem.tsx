'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Minus } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import type { CartLineItem as CartLineItemType } from '@/lib/types';

interface CartLineItemProps {
  item: CartLineItemType;
}

export function CartLineItem({ item }: CartLineItemProps) {
  const { removeItem, updateItemQuantity } = useCart();
  const { toast } = useToast();

  const handleRemove = () => {
    removeItem(item.product.id);
    toast({
      title: 'Producto eliminado',
      description: `${item.product.name} ha sido eliminado de tu carrito.`,
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      updateItemQuantity(item.product.id, newQuantity);
    } else {
        handleRemove();
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
  };


  return (
    <div className="flex items-center gap-4 py-4">
      <div className="relative h-24 w-24 rounded-md overflow-hidden">
        <Image
          src={item.product.image}
          alt={item.product.name}
          fill
          className="object-cover"
          data-ai-hint={item.product.aiHint}
        />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <Link href={`/product/${item.product.id}`} className="font-semibold hover:underline">
          {item.product.name}
        </Link>
        <span className="text-sm text-muted-foreground">{item.product.category}</span>
        <div className="flex items-center gap-2 mt-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.quantity - 1)}>
                <Minus className="h-4 w-4" />
            </Button>
            <Input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
                className="w-16 h-8 text-center"
            />
             <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.quantity + 1)}>
                <Plus className="h-4 w-4" />
            </Button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <p className="font-bold text-lg">{formatPrice(item.product.price * item.quantity)}</p>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleRemove}>
          <X className="h-5 w-5" />
          <span className="sr-only">Eliminar producto</span>
        </Button>
      </div>
    </div>
  );
}
