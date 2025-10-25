'use server';

import { notFound } from 'next/navigation';
import { wellnessProducts } from '@/lib/products-data'; // Import from local data
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductDetailClient } from './ProductDetailClient';
import type { Product } from '@/lib/types';

// This is the main Server Component
export default async function ProductDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  // Find the product from the local static data array
  const product: Product | undefined = wellnessProducts.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  // The Server Component fetches the data and passes it to the Client Component.
  // It does NOT use any hooks.
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* 
            The client component ProductDetailClient will handle all the logic 
            that requires hooks like useAuth, useRouter, useState, etc.
          */}
          <ProductDetailClient product={{...product}} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
