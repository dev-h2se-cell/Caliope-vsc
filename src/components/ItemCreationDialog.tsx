'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { createProduct, createService } from '@/app/admin/actions';

const productSchema = z.object({
  name: z.string().min(3, 'El nombre es obligatorio.'),
  category: z.string().min(3, 'La categoría es obligatoria.'),
  description: z.string().min(10, 'La descripción es obligatoria.'),
  price: z.preprocess((val) => Number(val), z.number().min(0, 'El precio debe ser positivo.')),
  image: z.string().url('Debes pegar una URL de imagen válida.'),
  inStock: z.boolean().default(true),
  aiHint: z.string().optional(),
});

const serviceSchema = z.object({
  name: z.string().min(3, 'El nombre es obligatorio.'),
  category: z.string().min(3, 'La categoría es obligatoria.'),
  description: z.string().min(10, 'La descripción es obligatoria.'),
  price: z.preprocess((val) => Number(val), z.number().min(0, 'El precio debe ser positivo.')),
  image: z.string().url('Debes pegar una URL de imagen válida.'),
  duration: z.preprocess((val) => Number(val), z.number().min(5, 'La duración debe ser al menos 5 minutos.')),
  aiHint: z.string().optional(),
});

type ItemCreationDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  itemType: 'product' | 'service';
  onSuccess: () => void;
};

export function ItemCreationDialog({ isOpen, onOpenChange, itemType, onSuccess }: ItemCreationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const isProduct = itemType === 'product';
  const schema = isProduct ? productSchema : serviceSchema;

  const form = useForm({
    resolver: zodResolver(schema as any),
    defaultValues: (isProduct 
      ? { name: '', category: '', description: '', price: 0, image: '', inStock: true, aiHint: '' }
      : { name: '', category: '', description: '', price: 0, image: '', duration: 60, aiHint: '' }) as any
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      const result = isProduct
        // @ts-ignore
        ? await createProduct(values)
        // @ts-ignore
        : await createService(values);

      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
        onSuccess();
        form.reset();
        onOpenChange(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: 'Error al crear',
        description: error.message || 'No se pudo crear el ítem.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!isLoading) {
            onOpenChange(open);
            if (!open) {
              form.reset();
            }
        }
    }}>
      <DialogContent className="sm:max-w-[480px] grid-rows-[auto,1fr,auto] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo {isProduct ? 'Producto' : 'Servicio'}</DialogTitle>
          <DialogDescription>
            Completa los detalles para añadir un nuevo ítem al catálogo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto pr-6 pl-1 -mr-6 -ml-1">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && <p className="text-destructive text-xs">{form.formState.errors.name.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Input id="category" {...form.register('category')} />
            {form.formState.errors.category && <p className="text-destructive text-xs">{form.formState.errors.category.message as string}</p>}
          </div>
           <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" {...form.register('description')} />
            {form.formState.errors.description && <p className="text-destructive text-xs">{form.formState.errors.description.message as string}</p>}
          </div>
           <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="price">Precio (COP)</Label>
                <Input id="price" type="number" {...form.register('price')} />
                {form.formState.errors.price && <p className="text-destructive text-xs">{form.formState.errors.price.message as string}</p>}
              </div>
              {!isProduct && (
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración (min)</Label>
                    <Input id="duration" type="number" {...form.register('duration')} />
                    {form.formState.errors.duration && <p className="text-destructive text-xs">{form.formState.errors.duration.message as string}</p>}
                  </div>
              )}
           </div>
            <div className="space-y-2">
                <Label htmlFor="image">URL de la Imagen</Label>
                <Input id="image" placeholder="https://firebasestorage.googleapis.com/..." {...form.register('image')} />
                 {form.formState.errors.image && <p className="text-destructive text-xs">{form.formState.errors.image.message as string}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="aiHint">Pista para IA (Hint)</Label>
                <Input id="aiHint" placeholder="Ej: spa, relax" {...form.register('aiHint')} />
            </div>
            {isProduct && (
                <div className="flex items-center space-x-2">
                    <Controller
                        control={form.control}
                        name="inStock"
                        render={({ field }) => (
                           <Switch
                            id="in-stock"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        )}
                    />
                    <Label htmlFor="in-stock">Disponible en stock</Label>
                </div>
            )}
             <DialogFooter className="sticky bottom-0 bg-background py-4 -mx-6 px-6">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Crear {isProduct ? 'Producto' : 'Servicio'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}