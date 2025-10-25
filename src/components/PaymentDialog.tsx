'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { Loader2, CreditCard, Landmark, Truck } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  totalPrice: number;
}

const paymentMethods = [
  { id: 'nequi', name: 'Nequi / PSE', icon: Landmark },
  { id: 'credit_card', name: 'Tarjeta de Crédito/Débito', icon: CreditCard },
  { id: 'cash_on_delivery', name: 'Pago Contra Entrega', icon: Truck },
];

export function PaymentDialog({ isOpen, onOpenChange, totalPrice }: PaymentDialogProps) {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<string | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: 'Acción requerida',
        description: 'Debes iniciar sesión para completar tu compra.',
        variant: 'destructive',
      });
      return;
    }
    if (!selectedMethod) {
      toast({
        title: 'Acción requerida',
        description: 'Por favor, selecciona un método de pago.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    // Simulate a successful payment after a short delay
    setTimeout(() => {
      toast({
        title: '¡Gracias por tu compra!',
        description: 'Tu pedido ha sido procesado con éxito.',
      });
      clearCart();
      onOpenChange(false);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Elige tu método de pago</DialogTitle>
          <DialogDescription>
            Selecciona cómo te gustaría pagar tu pedido.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <Label
                  key={method.id}
                  htmlFor={method.id}
                  className="flex items-center space-x-3 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary"
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  <method.icon className="h-6 w-6" />
                  <span>{method.name}</span>
                </Label>
              ))}
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button
            type="button"
            className="w-full"
            onClick={handlePayment}
            disabled={isProcessing || !selectedMethod}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Pedido (
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(totalPrice)}
            )
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
