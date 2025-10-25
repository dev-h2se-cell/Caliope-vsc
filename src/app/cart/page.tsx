
'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/EmptyState';
import { CartLineItem } from '@/components/CartLineItem';
import Link from 'next/link';
import { PaymentDialog } from '@/components/PaymentDialog';
import { useState } from 'react';


export default function CartPage() {
  const { items, totalPrice, totalItems } = useCart();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = () => {
    setIsPaymentDialogOpen(true);
  };

  return (
    <>
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        totalPrice={totalPrice}
      />
      <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
          <h1 className="text-3xl font-bold text-primary mb-6">Tu Carrito de Compras</h1>
          {totalItems === 0 ? (
            <EmptyState
              icon="🛒"
              title="Tu carrito está vacío"
              description="Parece que aún no has añadido ningún producto."
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                  <Card>
                      <CardHeader>
                          <CardTitle>Resumen de Productos ({totalItems})</CardTitle>
                      </CardHeader>
                      <CardContent className="divide-y">
                          {items.map(item => (
                              <CartLineItem key={item.product.id} item={item} />
                          ))}
                      </CardContent>
                  </Card>
              </div>
              <div className="lg:col-span-1">
                  <Card className="sticky top-24">
                      <CardHeader>
                          <CardTitle>Resumen del Pedido</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>{formatPrice(totalPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                              <span>Envío</span>
                              <span>Gratis</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-bold text-lg">
                              <span>Total</span>
                              <span>{formatPrice(totalPrice)}</span>
                          </div>
                      </CardContent>
                      <CardFooter className="flex-col gap-2">
                          <Button className="w-full" onClick={handleCheckout} disabled={totalItems === 0}>
                              Proceder al Pago
                          </Button>
                          <Button variant="outline" className="w-full" asChild>
                              <Link href="/catalog">Seguir Comprando</Link>
                          </Button>
                      </CardFooter>
                  </Card>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
