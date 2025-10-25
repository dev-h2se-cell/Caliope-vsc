import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from './EmptyState';

export function HistoryDisplay() {
  // En el futuro, este componente obtendrá el historial de un estado o API.
  const history: any[] = [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">Historial de Recomendaciones</CardTitle>
        <CardDescription>Aquí puedes ver las recomendaciones que has explorado en el pasado.</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <div>
            {/* Mapear sobre el historial aquí */}
          </div>
        ) : (
          <EmptyState
            icon="🕰️"
            title="Tu historial está vacío"
            description="Las recomendaciones que recibas y guardes aparecerán aquí."
          />
        )}
      </CardContent>
    </Card>
  );
}
