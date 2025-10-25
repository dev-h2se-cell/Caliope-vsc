'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import useAuth from '@/hooks/use-auth';
import { Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Review } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  rating: z.number().min(1, 'La calificación es obligatoria.').max(5),
  comment: z.string().min(10, 'Tu comentario debe tener al menos 10 caracteres.'),
});

type ReviewFormValues = z.infer<typeof formSchema>;

interface ReviewFormProps {
  targetId: string;
  onSubmit: (data: Omit<Review, 'id' | 'date' | 'userId' | 'targetType'>) => Promise<void>;
}

export function ReviewForm({ targetId, onSubmit }: ReviewFormProps) {
  const { user } = useAuth();
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const handleFormSubmit = async (data: ReviewFormValues) => {
    if (!user) return; 

    setIsLoading(true);

    const newReview = {
        targetId,
        userName: user.displayName || 'Usuario Anónimo',
        userAvatarFallback: user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U',
        ...data
    };
    
    await onSubmit(newReview);
    form.reset();
    setIsLoading(false);
  };

  if (!user) {
    return (
      <div className="p-4 text-center bg-secondary/30 rounded-lg">
        <p className="text-muted-foreground">Debes <a href="/login" className="text-primary hover:underline font-semibold">iniciar sesión</a> para dejar una reseña.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-headline text-primary mb-4">Escribe tu propia reseña</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tu calificación</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = index + 1;
                      return (
                        <button
                          type="button"
                          key={ratingValue}
                          onClick={() => field.onChange(ratingValue)}
                          onMouseEnter={() => setHoverRating(ratingValue)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={cn(
                              'w-8 h-8 cursor-pointer transition-colors',
                              ratingValue <= (hoverRating || field.value)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tu comentario</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe tu experiencia con el servicio..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
            Publicar Reseña
          </Button>
        </form>
      </Form>
    </div>
  );
}
