
import AdminPageClient from '@/components/AdminPageClient';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Este es ahora un Componente de Servidor simple para la ruta /admin.
// Su única responsabilidad es renderizar el layout y el componente de cliente.
// Toda la lógica de obtención de datos se manejará en el lado del cliente.
export default function AdminPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="space-y-2 mb-8">
                        <h1 className="text-3xl font-bold text-primary">Panel de Administración</h1>
                        <p className="text-lg text-muted-foreground">
                            Bienvenido al centro de control de Caliope.
                        </p>
                    </div>
                    {/* El componente de cliente ahora se encarga de todo el fetching de datos */}
                    <AdminPageClient />
                </div>
            </main>
            <Footer />
        </div>
    );
}
