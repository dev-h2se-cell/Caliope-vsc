
"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { WellnessService } from '@/lib/types';
import { StarRating } from './StarRating';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import useAuth from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface RecommendationCardProps {
  service: WellnessService;
}

export function RecommendationCard({ service }: RecommendationCardProps) {
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!loading && !user) {
        e.preventDefault();
        toast({
            title: 'Acción requerida',
            description: 'Por favor, regístrate o inicia sesión para ver los detalles del servicio.',
            variant: 'destructive'
        });
        router.push('/login');
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full flex flex-col"
    >
      <Link 
          href={`/service/${service.id}`} 
          onClick={handleCardClick}
          className="flex flex-col group h-full"
      >
        <Card className="flex flex-col flex-grow overflow-hidden transition-shadow hover:shadow-xl bg-card h-full">
          <div className="relative w-full h-48">
            <Image
              src={service.image}
              alt={service.name}
              fill
              className="object-cover w-full h-full"
              data-ai-hint={service.aiHint}
            />
          </div>
          <CardHeader>
            <p className="text-sm font-semibold text-primary">{service.category}</p>
            <CardTitle className="text-lg font-headline">{service.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
          </CardContent>
          <CardFooter className="flex-col items-start gap-4 pt-4 mt-auto">
             <div className='w-full flex justify-between items-center'>
                <StarRating rating={service.rating} reviewCount={service.reviewCount} />
                <p className="text-lg font-bold text-primary">${new Intl.NumberFormat('es-CO').format(service.price)}</p>
            </div>
             <Button className="w-full mt-2" variant="outline">
                Ver detalles y reservar
                <ArrowRight className="ml-2 h-4 w-4" />
             </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
