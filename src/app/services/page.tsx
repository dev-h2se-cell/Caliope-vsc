
'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import type { WellnessService } from '@/lib/types';
import { RecommendationCard } from '@/components/RecommendationCard';
import { wellnessServices } from '@/lib/wellness-services-data';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';

function CatalogGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
               <Skeleton key={i} className="h-80 w-full" />
            ))}
        </div>
    )
}

export default function ServicesPage() {
  const [services, setServices] = useState<WellnessService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
        setLoading(true);
        // Simulate a network call
        await new Promise(resolve => setTimeout(resolve, 500));
        setServices(wellnessServices);
        setLoading(false);
    }
    loadServices();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold text-primary">Nuestros Servicios</h1>
            <p className="text-lg text-muted-foreground">
                Explora nuestra gama completa de servicios de bienestar diseñados para ti.
            </p>
        </div>
        {loading ? (
            <CatalogGridSkeleton />
        ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map(service => (
                <RecommendationCard key={service.id} service={service} />
              ))}
            </div>
        ) : (
             <EmptyState icon="🧘‍♀️" title="Próximamente" description="Nuestro catálogo de servicios está en construcción. ¡Vuelve pronto para descubrir experiencias increíbles!" />
        )}
      </main>
      <Footer />
    </div>
  );
}
