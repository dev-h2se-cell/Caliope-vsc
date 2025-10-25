
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, HeartPulse, Search, Star } from 'lucide-react';
import { RecommendationCard } from '@/components/RecommendationCard';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { wellnessServices } from '@/lib/wellness-services-data';


export default async function HomePage() {
    // Los datos ahora se cargan de un archivo local para estabilidad y rendimiento.
    const featuredServices = wellnessServices.slice(0, 3);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
            <Header />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center text-white px-4">
                    <div className="absolute inset-0">
                        <Image
                            src="https://picsum.photos/seed/wellness-hero/1200/800"
                            alt="Mujer relajándose en un entorno de bienestar"
                            fill
                            className="object-cover"
                            priority
                            data-ai-hint="wellness relax"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
                    </div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 drop-shadow-lg">
                            Tu Bienestar, Curado para Ti
                        </h1>
                        <p className="text-lg md:text-xl mb-8 drop-shadow-md">
                            Caliope es tu guía personalizada para encontrar los mejores servicios y productos de bienestar. Redescubre tu equilibrio y confianza.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" asChild>
                                <Link href="/services">
                                    Explorar Servicios
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="/register">Únete a Caliope</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Featured Services Section */}
                <section className="py-16 lg:py-24 bg-secondary/50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Servicios Destacados</h2>
                            <p className="text-lg text-muted-foreground mt-2">Descubre nuestras experiencias de bienestar más populares.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                           {featuredServices.map(service => (
                                <RecommendationCard key={service.id} service={service} />
                           ))}
                        </div>
                        <div className="text-center mt-12">
                            <Button asChild size="lg">
                                <Link href="/services">
                                    Ver todos los servicios
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
                
                {/* How it works section */}
                <section className="py-16 lg:py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">¿Cómo funciona?</h2>
                            <p className="text-lg text-muted-foreground mt-2">Encuentra tu bienestar en 3 simples pasos.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <Card className="p-8 border-none shadow-none">
                                <CardContent>
                                    <Search className="h-12 w-12 text-accent mx-auto mb-4"/>
                                    <h3 className="text-xl font-bold mb-2">1. Descubre</h3>
                                    <p className="text-muted-foreground">Explora un catálogo curado de servicios y profesionales verificados.</p>
                                </CardContent>
                            </Card>
                             <Card className="p-8 border-none shadow-none">
                                <CardContent>
                                    <HeartPulse className="h-12 w-12 text-accent mx-auto mb-4"/>
                                    <h3 className="text-xl font-bold mb-2">2. Personaliza</h3>
                                    <p className="text-muted-foreground">Usa nuestro asistente de IA para obtener recomendaciones a tu medida.</p>
                                </CardContent>
                            </Card>
                             <Card className="p-8 border-none shadow-none">
                                <CardContent>
                                    <Star className="h-12 w-12 text-accent mx-auto mb-4"/>
                                    <h3 className="text-xl font-bold mb-2">3. Disfruta</h3>
                                    <p className="text-muted-foreground">Reserva fácilmente y disfruta de una experiencia de bienestar única.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                
                {/* Testimonials */}
                <section className="py-16 lg:py-24 bg-secondary/50">
                    <div className="container mx-auto px-4">
                         <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Lo que dicen nuestros usuarios</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Card className="p-6 bg-background">
                                <CardContent className="p-0">
                                    <div className="flex items-center mb-4">
                                        <Avatar>
                                            <AvatarFallback>ER</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4">
                                            <p className="font-semibold">Elena R.</p>
                                            <p className="text-sm text-muted-foreground">Cliente Verificada</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground italic">&quot;¡Una experiencia increíble! Encontré exactamente lo que necesitaba para relajarme. La plataforma es muy fácil de usar.&quot;</p>
                                </CardContent>
                            </Card>
                             <Card className="p-6 bg-background">
                                <CardContent className="p-0">
                                    <div className="flex items-center mb-4">
                                        <Avatar>
                                            <AvatarFallback>MG</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4">
                                            <p className="font-semibold">Marcos G.</p>
                                            <p className="text-sm text-muted-foreground">Cliente Verificado</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground italic">&quot;El mejor servicio que he probado. El profesional fue excelente y la reserva fue instantánea. ¡Muy recomendado!&quot;</p>
                                </CardContent>
                            </Card>
                             <Card className="p-6 bg-background">
                                <CardContent className="p-0">
                                    <div className="flex items-center mb-4">
                                        <Avatar>
                                            <AvatarFallback>LF</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4">
                                            <p className="font-semibold">Lucía F.</p>
                                            <p className="text-sm text-muted-foreground">Cliente Verificada</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground italic">&quot;Caliope ha cambiado mi rutina de bienestar. La variedad y calidad de los servicios es insuperable. ¡Me encanta!&quot;</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                
                {/* Final CTA */}
                <section className="py-16 lg:py-24 text-center">
                    <div className="container mx-auto px-4">
                         <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-4">¿Lista para tu transformación?</h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Únete a nuestra comunidad y comienza tu viaje personalizado hacia el bienestar hoy mismo.</p>
                        <Button size="lg" asChild>
                            <Link href="/register">Empieza Ahora <ArrowRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
