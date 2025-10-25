
'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import useAuth from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserProfileSidebar } from '@/components/UserProfileSidebar';
import { HistoryDisplay } from '@/components/HistoryDisplay';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase-config';
import { Skeleton } from '@/components/ui/skeleton';
import { RewardsDisplay } from '@/components/RewardsDisplay';
import { handleUserProfileUpdateAction } from '../actions';
import { Separator } from '@/components/ui/separator';
import CaliopeApp from '@/components/CaliopeApp';
import Link from 'next/link';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function EditProfileForm() {
    const { user, profile, fetchProfile } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
        },
    });
    
    useEffect(() => {
        if (profile) {
            form.reset({
                name: profile.name || user?.displayName || '',
                email: profile.email || user?.email || '',
                phone: profile.phone || '',
                address: profile.address || '',
            });
        } else if (user) {
             form.reset({
                name: user.displayName || '',
                email: user.email || '',
                phone: '',
                address: '',
            });
        }
    }, [user, profile, form]);

    const onSubmit = async (data: ProfileFormValues) => {
        if (!user) return;
        setIsLoading(true);
        try {
            // Update Firebase Auth display name
            if (user.displayName !== data.name) {
                await updateProfile(user, { displayName: data.name });
            }

            // Update Firestore profile via server action
            const backendResult = await handleUserProfileUpdateAction({
                uid: user.uid,
                name: data.name,
                // @ts-ignore
                phone: data.phone,
                address: data.address,
            });

            if (!backendResult.success) {
                // Ugly but necessary: The build environment refuses to see the 'error' property.
                throw new Error((backendResult as any).error || 'Error al actualizar el perfil en la base de datos.');
            }
            
            toast({
                title: 'Perfil actualizado',
                description: 'Tu información ha sido actualizada correctamente.',
            });

            // Re-fetch profile to update UI state
            await fetchProfile(user);

        } catch (error: any) {
            toast({
                title: 'Error al actualizar',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tu Perfil</CardTitle>
                <CardDescription>Aquí puedes editar la información de tu perfil público y tus datos de contacto.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-4">Información Básica</h4>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre Completo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tu nombre" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Correo Electrónico</FormLabel>
                                            <FormControl>
                                                <Input disabled {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <Separator/>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-4">Datos de Envío y Publicidad</h4>
                             <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teléfono</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tu número de teléfono" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dirección de Envío</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tu dirección" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Cambios
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}

function UserDashboardContent({ isLoading }: { isLoading: boolean }) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                     <Skeleton className="h-8 w-1/2 mb-2" />
                     <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-48" />
                    </div>
                     <Skeleton className="h-48 w-full" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Tabs defaultValue="recommendations" className="w-full">
            <div className='flex justify-between items-center mb-4'>
                <TabsList>
                    <TabsTrigger value="recommendations">Asistente</TabsTrigger>
                    <TabsTrigger value="rewards">Mis Recompensas</TabsTrigger>
                    <TabsTrigger value="history">Historial</TabsTrigger>
                    <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
                    <TabsTrigger value="agenda">Mi Agenda</TabsTrigger>
                </TabsList>
                <Button asChild>
                    <Link href="/catalog">Ir a la Tienda</Link>
                </Button>
            </div>
            <TabsContent value="recommendations">
                <CaliopeApp />
            </TabsContent>
            <TabsContent value="rewards">
                <RewardsDisplay />
            </TabsContent>
            <TabsContent value="history">
                <HistoryDisplay />
            </TabsContent>
            <TabsContent value="profile">
                <EditProfileForm />
            </TabsContent>
            <TabsContent value="agenda">
                <Card>
                    <CardHeader>
                        <CardTitle>Tu Agenda</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Aquí aparecerán tus próximas citas y podrás gestionarlas.</p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

export default function ProfilePage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // La página se considera "cargando" si el estado de auth está cargando,
    // o si tenemos un usuario pero todavía no tenemos su perfil de Firestore.
    const isLoading = Boolean(loading || (user && !profile));

    if (loading && !user) { // Muestra un loader a pantalla completa solo si no hay usuario y se está cargando
        return (
            <div className="flex flex-col min-h-screen justify-center items-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Cargando...</p>
            </div>
        );
    }
    
    if (!user) {
        // El useEffect ya se habrá encargado de redirigir
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen bg-secondary/50">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    <div className="lg:col-span-1">
                        <UserProfileSidebar loading={isLoading} />
                    </div>
                    <div className="lg:col-span-3">
                        <UserDashboardContent isLoading={isLoading} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

    
