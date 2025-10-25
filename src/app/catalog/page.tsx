
'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Product, WellnessService } from '@/lib/types';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecommendationCard } from '@/components/RecommendationCard';
import { useEffect, useState } from 'react';
import { wellnessServices } from '@/lib/wellness-services-data';
import { wellnessProducts } from '@/lib/products-data';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/ProductCard';

function CatalogGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-96 w-full" />
            ))}
        </div>
    )
}


export default function CatalogPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [services, setServices] = useState<WellnessService[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            // Simulate fetching data
            await new Promise(resolve => setTimeout(resolve, 500));
            setProducts(wellnessProducts);
            setServices(wellnessServices);
            setLoading(false);
        }
        loadData();
    }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold text-primary">Nuestra Tienda</h1>
            <p className="text-lg text-muted-foreground">
                Explora nuestra selección curada de productos y servicios para tu bienestar.
            </p>
        </div>

        <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
                <TabsTrigger value="products">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Productos
                </TabsTrigger>
                <TabsTrigger value="services">
                    <Sparkles className="mr-2 h-4 w-4" /> Servicios
                </TabsTrigger>
            </TabsList>
            <TabsContent value="products">
                 {loading ? <CatalogGridSkeleton /> : products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                 ) : <EmptyState icon="😕" title="No hay productos" description="Nuestro catálogo de productos está vacío en este momento. Vuelve pronto."/>}
            </TabsContent>
            <TabsContent value="services">
                 {loading ? <CatalogGridSkeleton /> : services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {services.map(service => (
                            <RecommendationCard key={service.id} service={service} />
                        ))}
                    </div>
                ) : <EmptyState icon="😕" title="No hay servicios" description="Nuestro catálogo de servicios está vacío en este momento. Vuelve pronto."/>}
            </TabsContent>
        </Tabs>
        
      </main>
      <Footer />
    </div>
  );
}
