
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase-config';
import { handleProfessionalRegistrationAction } from '@/app/actions';


const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
  bio: z.string().min(20, { message: 'Tu biografía debe tener al menos 20 caracteres.' }),
  specialties: z.string().min(3, { message: 'Introduce al menos una especialidad.' }),
});

export function ProfessionalRegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      bio: '',
      specialties: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!auth) {
        toast({
          title: 'Error de configuración',
          description: 'Firebase Auth no está inicializado. Revisa tus variables de entorno.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      // 1. Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      // 2. Actualizar el perfil de Auth con el nombre
      await updateProfile(user, { displayName: values.name });

      // 3. Llamar al flujo de Genkit para crear los perfiles en Firestore
      const backendResult = await handleProfessionalRegistrationAction({
        uid: user.uid,
        name: values.name,
        email: values.email,
        bio: values.bio,
        specialties: values.specialties.split(',').map(s => s.trim()),
      });

      if (!backendResult.success) {
        if (backendResult.error?.includes('administrador no está inicializada')) {
          console.warn('Backend no inicializado. Se procede sin creación de perfil en DB (entorno de desarrollo).');
        } else {
          throw new Error(backendResult.error || 'Error en el servidor al crear el perfil profesional.');
        }
      }

      toast({
        title: '¡Bienvenida/o, profesional!',
        description: 'Tu perfil ha sido creado y está pendiente de verificación.',
      });
      router.push('/professional/dashboard'); 
      
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Error en el registro',
        description: error.message || 'No se pudo completar el registro. El correo puede que ya esté en uso.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro para Profesionales</CardTitle>
        <CardDescription>
          Únete a Caliope para ofrecer tus servicios de bienestar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre y apellido" {...field} />
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
                    <Input placeholder="tu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tu Biografía</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Cuéntanos sobre tu experiencia, tu enfoque y lo que te apasiona de tu trabajo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidades</FormLabel>
                  <FormControl>
                    <Input placeholder="Masaje terapéutico, Yoga, Nutrición..." {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">Separa tus especialidades con comas.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Perfil Profesional
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center w-full">
            ¿Ya tienes una cuenta? <a href="/login" className="text-primary hover:underline">Inicia sesión</a>
        </p>
      </CardFooter>
    </Card>
  );
}
