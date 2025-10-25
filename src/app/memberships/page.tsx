'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { membershipPlans } from '@/lib/memberships-data';
import type { Membership } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import useAuth from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

function MembershipCard({ plan }: { plan: Membership }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
  };
  
  const handleSubscribe = () => {
    if (!loading && !user) {
        toast({
            title: 'Acción requerida',
            description: 'Debes iniciar sesión o registrarte para suscribirte.',
            variant: 'destructive'
        });
        router.push('/login');
    } else {
        // Lógica de suscripción futura
        toast({
            title: `Suscripción a ${plan.name}`,
            description: '¡Gracias por tu interés! La funcionalidad de pago estará disponible pronto.',
        });
    }
  };

  return (
    <Card className={cn("flex flex-col", plan.isPopular && "border-primary ring-2 ring-primary shadow-lg")}>
      {plan.isPopular && (
          <div className="bg-primary text-primary-foreground text-xs font-bold text-center py-1 rounded-t-lg flex items-center justify-center gap-2">
            <Star className="h-4 w-4" /> MÁS POPULAR
          </div>
      )}
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <div className="text-center">
          <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
          <span className="text-muted-foreground">{plan.priceDescription}</span>
        </div>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubscribe}>
          {plan.isPopular ? 'Comenzar ahora' : 'Seleccionar plan'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function MembershipsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Elige tu Membresía Caliope</h1>
          <p className="text-lg text-muted-foreground">
            Desbloquea beneficios exclusivos y lleva tu viaje de bienestar al siguiente nivel con un plan adaptado a ti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {membershipPlans.map((plan) => (
            <MembershipCard key={plan.id} plan={plan} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
