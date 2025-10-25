'use server';

import { notFound } from 'next/navigation';
import { wellnessServices } from '@/lib/wellness-services-data'; // Import from local data
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ServiceDetailClient } from './ServiceDetailClient';
import type { WellnessService } from '@/lib/types';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// This is the main Server Component
export default async function ServiceDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  const { id } = params;
  // In a real-world scenario, you would fetch a single service here.
  // For now, we find it from the local data source for stability.
  const service: WellnessService | undefined = wellnessServices.find(s => s.id === id);

  if (!service) {
    notFound();
  }

  // The Server Component fetches the data and passes it to the Client Component.
  // It does NOT use any hooks.
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver a servicios
          </Link>
          {/* 
            The client component ServiceDetailClient will handle all the logic 
            that requires hooks like useAuth, useRouter, useState, etc.
          */}
          <ServiceDetailClient service={{...service}} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
