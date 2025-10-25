
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase-config';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';
import useAuth from '@/hooks/use-auth'; // Importar el hook de autenticación

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.655-3.657-11.303-8h-1.303H12.58h-1.29l-6.571,4.819C9.656,41.663,16.318,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  password: z.string().min(1, { message: 'La contraseña no puede estar vacía.' }),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { signInWithGoogle, googleLoading } = useAuth(); // Usar el hook

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!auth) {
        toast({ title: 'Error de configuración', description: 'Firebase Auth no está inicializado.', variant: 'destructive' });
        setIsLoading(false);
        return;
      }
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: '¡Éxito!', description: 'Has iniciado sesión correctamente.' });
      router.push('/profile');
    } catch (error: any) {
      toast({ title: 'Error al iniciar sesión', description: "Revisa tu correo y contraseña.", variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>Accede a tu cuenta de Caliope.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* ... (Campos de email y contraseña se mantienen igual) ... */}
            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Correo Electrónico</FormLabel><FormControl><Input placeholder="tu@email.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Contraseña</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <Button type="submit" className="w-full" disabled={isLoading || googleLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar Sesión
            </Button>
          </form>
        </Form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">o</span></div>
        </div>
        <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={isLoading || googleLoading}>
           {googleLoading ? (
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
           ) : (
               <GoogleIcon className="mr-2 h-4 w-4" />
           )}
           Continuar con Google
        </Button>
      </CardContent>
       <CardFooter className="flex flex-col items-center justify-center gap-4">
            <p className="text-sm text-center w-full">
                ¿No tienes una cuenta? <a href="/register" className="text-primary hover:underline">Regístrate</a>
            </p>
            <p className="text-xs text-muted-foreground text-center">
                ¿Eres un profesional? <a href="/register/professional" className="text-primary hover:underline">Regístrate aquí</a>.
            </p>
      </CardFooter>
    </Card>
  );
}
