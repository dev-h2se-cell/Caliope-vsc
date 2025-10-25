
'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useAuth from '@/hooks/use-auth';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { auth } from '@/lib/firebase-config';
import Link from 'next/link';

export function UserAuthSection() {
    const { user, profile, loading, isDemo } = useAuth();

    const handleLogout = async () => {
        // La lógica de cierre de sesión ahora está unificada.
        // Si estamos en modo demo, la recarga de la página simulará un "logout".
        // Si estamos en modo real, `auth.signOut()` cerrará la sesión.
        if (isDemo) {
            window.location.reload();
            return;
        }

        if (auth) {
            await auth.signOut();
        } else {
            console.error("Firebase Auth no está inicializado. No se puede cerrar sesión.");
        }
    };

    if (loading) {
        return <Skeleton className="h-10 w-24" />;
    }
    
    // Si hay un usuario (real o demo), mostramos el perfil.
    if (user) {
        const displayName = profile?.name || user?.displayName || 'Usuario';
        const initial = displayName.charAt(0).toUpperCase() || 'U';

        return (
            <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-3">
                    <span className="hidden sm:inline font-semibold">
                        {displayName}
                    </span>
                    <Avatar>
                        <AvatarFallback className="bg-accent text-accent-foreground">
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                </Link>
                <Button variant="ghost" onClick={handleLogout}>Cerrar Sesión</Button>
            </div>
        );
    }

    // Si no hay usuario y no estamos cargando, mostramos los botones de login/registro.
    return (
        <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
                <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
                <Link href="/register">Registrarse</Link>
            </Button>
        </div>
    );
}
