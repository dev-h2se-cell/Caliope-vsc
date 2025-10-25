'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ChevronLeft, Clock, DollarSign, HeartPulse, Calendar as CalendarIcon, CheckCircle, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { add, format, setHours, setMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { ReviewList } from '@/components/ReviewList';
import { ReviewForm } from '@/components/ReviewForm';
import { mockReviews } from '@/lib/reviews-data';
import type { Review, WellnessService } from '@/lib/types';
import useAuth from '@/hooks/use-auth';

// This is a Client Component. It handles all user interaction and state.
export function ServiceDetailClient({ service }: { service: WellnessService | null }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const { toast } = useToast();

  useEffect(() => {
      if (!service) {
          router.push('/services');
      }
  }, [service, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      toast({ title: 'Acción requerida', description: 'Por favor, inicia sesión o regístrate para ver los detalles del servicio.', variant: 'destructive'});
      router.push('/login');
    }
  }, [user, authLoading, router, toast]);

  if (authLoading || !service || !user) {
      return (
          <div className="flex flex-col min-h-[50vh] justify-center items-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Cargando...</p>
          </div>
      )
  }

  const availableTimes = ['10:00', '11:30', '13:00', '14:30', '16:00'];

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Error',
        description: 'Por favor, selecciona una fecha y hora para tu cita.',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }
    
    setIsBooking(true);
    // Simulate booking
    setTimeout(() => {
        const [hour, minute] = selectedTime.split(':').map(Number);
        const appointmentDateTime = setMinutes(setHours(selectedDate, hour), minute);
        
        setIsBooked(true);
        toast({
          title: '¡Reserva confirmada!',
          description: `Tu cita para ${service.name} el ${format(appointmentDateTime, 'PPP', { locale: es })} a las ${selectedTime} ha sido confirmada. (Simulación)`,
        });
        setIsBooking(false);
    }, 1500);
  };
  
  const handleReviewSubmit = async (newReview: Omit<Review, 'id' | 'date' | 'userId' | 'targetType' | 'targetId'>) => {
    if (!user) return;

    // Simulate submission
    const reviewWithId: Review = {
        ...newReview,
        id: `rev-${Date.now()}`,
        date: new Date().toISOString(),
        userId: user.uid,
        targetId: service.id,
        targetType: 'service',
    };
    setReviews([reviewWithId, ...reviews]);
    
    toast({
        title: '¡Gracias por tu opinión!',
        description: 'Tu reseña ha sido publicada.',
    });
  };

  const today = new Date();
  const nextThreeMonths = add(today, { months: 3 });

  return (
      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="relative w-full h-64 md:h-80">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover"
            data-ai-hint={service.aiHint}
          />
        </div>
        <div className="p-6 md:p-8">
          <Badge variant="secondary" className="mb-2">{service.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-2">{service.name}</h1>
          <div className="mb-6">
            <StarRating rating={service.rating} reviewCount={service.reviewCount} />
          </div>
          <p className="text-base text-card-foreground/90 mb-6">{service.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center my-8">
            <div className="bg-secondary/50 p-4 rounded-lg flex flex-col items-center justify-center">
              <DollarSign className="h-8 w-8 text-accent mb-2" />
              <p className="font-bold text-lg">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(service.price)}</p>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg flex flex-col items-center justify-center">
              <Clock className="mx-auto h-8 w-8 text-accent mb-2" />
              <p className="font-bold text-lg">{service.duration} min</p>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg flex flex-col items-center justify-center">
              <HeartPulse className="mx-auto h-8 w-8 text-accent mb-2" />
              <p className="font-bold text-lg">Verificado</p>
            </div>
          </div>

          {isBooked ? (
            <div className="text-center p-8 bg-green-100 rounded-lg">
                <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-green-800">¡Cita Reservada!</h2>
                <p className="text-green-700 mt-2">Recibirás una confirmación por correo electrónico en breve.</p>
            </div>
          ) : (
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-headline text-primary mb-3 flex items-center gap-2"><CalendarIcon className="h-5 w-5" />Selecciona una fecha</h3>
                    <div className="flex justify-center">
                         <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            fromDate={today}
                            toDate={nextThreeMonths}
                            disabled={(date) => date < today}
                            className="rounded-md border"
                            locale={es}
                        />
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-headline text-primary mb-3 flex items-center gap-2"><Clock className="h-5 w-5" />Selecciona una hora</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {availableTimes.map(time => (
                            <Button 
                                key={time}
                                variant={selectedTime === time ? 'default' : 'outline'}
                                onClick={() => setSelectedTime(time)}
                            >
                                {time}
                            </Button>
                        ))}
                    </div>
                </div>
                <Button size="lg" className="w-full text-lg" onClick={handleBooking} disabled={isBooking || !user}>
                    {isBooking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isBooking ? 'Reservando...' : 'Reservar ahora'}
                </Button>
            </div>
          )}

          <Separator className="my-8" />

          <div className="space-y-8">
            <h2 className="text-2xl font-headline text-primary">Opiniones y Reseñas</h2>
            <ReviewList reviews={reviews} />
            <ReviewForm onSubmit={handleReviewSubmit} targetId={service.id} />
          </div>

        </div>
      </div>
  );
}
