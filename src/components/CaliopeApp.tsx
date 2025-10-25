'use client';

import { useState, useRef, useEffect } from 'react';
import type { RecommendationItem } from '@/lib/types';
import { getConciergeRecommendations } from '@/app/concierge/actions';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal, SparklesIcon } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import { cn } from '@/lib/utils';
import { RecommendationCard } from './RecommendationCard';
import { ProductCard } from './ProductCard';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
  isRecommendation?: boolean;
};

// Este componente ahora contiene la lógica del chat del asistente.
export default function CaliopeApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Saludo inicial del asistente
    if (messages.length === 0) {
      setMessages([
        {
          id: 'initial-greeting-profile',
          role: 'assistant',
          content: '¡Hola! Soy tu asistente personal. ¿Cómo puedo ayudarte a mejorar tu bienestar hoy?',
        },
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    // Scroll automático al final del chat
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const results = await getConciergeRecommendations(input);

    let finalResponse: Message;
    if (results.length > 0) {
      finalResponse = {
        id: `results-${Date.now()}`,
        role: 'assistant',
        isRecommendation: true,
        content: (
          <div className="space-y-4">
            <p>Basado en lo que me contaste, creo que esto podría ayudarte:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((item) =>
                item.type === 'service' ? (
                  <RecommendationCard key={item.id} service={item} />
                ) : (
                  <ProductCard key={item.id} product={item} />
                )
              )}
            </div>
          </div>
        ),
      };
    } else {
      finalResponse = {
        id: `no-results-${Date.now()}`,
        role: 'assistant',
        content: (
          <EmptyState
            icon="🧐"
            title="No encontré recomendaciones"
            description="Intenta con otras palabras clave como 'relajación', 'yoga' o 'cuidado facial' para encontrar lo que buscas."
          />
        ),
      };
    }
    setMessages((prev) => [...prev, finalResponse]);
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg h-[60vh] flex flex-col">
        <CardContent className="p-0 flex-grow flex flex-col">
            <div ref={chatContainerRef} className="flex-1 p-6 space-y-6 overflow-y-auto">
                <AnimatePresence>
                    {messages.map(message => (
                        <motion.div
                            key={message.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                                "flex items-start gap-4",
                                message.role === 'user' && "justify-end"
                            )}
                        >
                            {message.role === 'assistant' && (
                                <Avatar className="w-8 h-8 shrink-0">
                                    <AvatarFallback className="bg-primary text-primary-foreground">C</AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn(
                                "max-w-md rounded-2xl p-4",
                                message.role === 'user' ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-muted-foreground rounded-bl-none",
                                message.isRecommendation && "bg-transparent p-0 w-full max-w-full"
                            )}>
                                {message.content}
                            </div>
                            {message.role === 'user' && (
                                <Avatar className="w-8 h-8 shrink-0">
                                    <AvatarFallback>Tú</AvatarFallback>
                                </Avatar>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-4"
                    >
                        <Avatar className="w-8 h-8 shrink-0">
                            <AvatarFallback className="bg-primary text-primary-foreground">C</AvatarFallback>
                        </Avatar>
                        <div className="max-w-md bg-muted text-muted-foreground rounded-2xl rounded-bl-none p-4 flex items-center">
                            <LoadingSpinner className="h-5 w-5 mr-3"/>
                            Pensando...
                        </div>
                    </motion.div>
                )}
            </div>
            <div className="p-4 border-t bg-background rounded-b-lg">
                <form onSubmit={handleSubmit} className="flex items-center gap-4">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe cómo te sientes o qué buscas..."
                        className="flex-1"
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        <SendHorizonal className="h-5 w-5" />
                        <span className="sr-only">Enviar</span>
                    </Button>
                </form>
            </div>
        </CardContent>
    </Card>
  );
}
