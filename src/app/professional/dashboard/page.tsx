
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/use-auth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loader2, User, Calendar, BarChart2, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function LoadingScreen() {
    return (
        <div className="flex flex-col min-h-screen justify-center items-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Verificando credenciales...</p>
        </div>
    );
}

function AccessDenied() {
    return (
        <div className="flex flex-col min-h-screen bg-secondary/30">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex items-center justify-center">
                <Card className="text-center mt-10 max-w-lg w-full">
                    <CardHeader>
                        <div className="mx-auto bg-destructive/10 rounded-full p-3 w-fit">
                            <Lock className="mx-auto h-10 w-10 text-destructive" />
                        </div>
                        <CardTitle className="mt-4">Acceso Denegado</CardTitle>
                        <CardDescription>Esta sección es exclusiva para profesionales. Regístrate como uno para acceder.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button asChild>
                            <Link href="/register/professional">Registrarme como Profesional</Link>
                        </Button>
                         <Button asChild variant="outline">
                            <Link href="/">Volver al Inicio</Link>
                        </Button>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}

function ProfessionalDashboard() {
    const { user } = useAuth();
    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Ingresos del Mes
                        </CardTitle>
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">(Próximamente)</div>
                        <p className="text-xs text-muted-foreground">
                            Estadísticas de tus ganancias.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Próximas Citas
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">(Próximamente)</div>
                         <p className="text-xs text-muted-foreground">
                            Tu agenda a un vistazo.
                        </p>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Gestiona tu Negocio</CardTitle>
                    <CardDescription>
                        Aquí encontrarás todas las herramientas para administrar tu perfil, servicios y agenda en Caliope.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                        <User className="h-6 w-6 text-primary" />
                        <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            Mi Perfil Público
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Actualiza tu bio, especialidades y foto.
                        </p>
                        </div>
                        <Button variant="outline" disabled>Editar</Button>
                    </div>
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                        <Calendar className="h-6 w-6 text-primary" />
                        <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            Mi Agenda
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Visualiza y gestiona todas tus citas.
                        </p>
                        </div>
                        <Button variant="outline" disabled>Ver</Button>
                    </div>
                </CardContent>
             </Card>
        </div>
    )
}

export default function ProfessionalDashboardPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);
    
    if (loading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return null;
    }
    
    // Una vez que la carga de auth ha terminado, verificamos el perfil
    if (!profile?.isProfessional) {
        return <AccessDenied />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="space-y-2 mb-8">
                        <h1 className="text-3xl font-bold text-primary">Portal de Profesional</h1>
                        <p className="text-lg text-muted-foreground">
                            Bienvenido/a, {user.displayName || 'Profesional'}. Desde aquí puedes gestionar tu presencia en Caliope.
                        </p>
                    </div>
                   <ProfessionalDashboard />
                </div>
            </main>
            <Footer />
        </div>
    );
}
