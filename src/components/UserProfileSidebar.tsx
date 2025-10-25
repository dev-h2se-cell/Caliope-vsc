
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, ShoppingBag, Gift, Lightbulb, BadgeCheck, ArrowUpCircle } from "lucide-react";
import useAuth from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { getUserLevel, getProgressToNextLevel } from "@/lib/user-levels";
import { Progress } from "./ui/progress";

interface UserProfileSidebarProps {
    loading?: boolean;
}

function SidebarSkeleton() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="w-full space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </CardHeader>
                <CardFooter className="p-4 pt-0">
                     <Skeleton className="h-9 w-full" />
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2"><Skeleton className="h-5 w-5 rounded-full" /><Skeleton className="h-5 w-32" /></CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="space-y-2">
                        <Skeleton className="h-2 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function UserProfileSidebar({ loading: isLoadingProp }: UserProfileSidebarProps) {
  const { user, profile, loading: authLoading } = useAuth();
  
  // The component is loading if the auth hook is loading, or if we have a user but no profile yet.
  const isLoading = isLoadingProp || authLoading || (user && !profile);
  
  const loyaltyPoints = profile?.loyaltyPoints || 0;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const levelInfo = getUserLevel(loyaltyPoints);
  const { progress, pointsToNext } = getProgressToNextLevel(loyaltyPoints, levelInfo);

  if (isLoading) {
      return <SidebarSkeleton />;
  }

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
        <Card>
            <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2">
                <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-xl bg-primary/10 text-primary">
                        {getInitials(profile?.name || user?.displayName)}
                    </AvatarFallback>
                </Avatar>
                <div className="w-full">
                    <CardTitle className="font-headline text-primary text-lg">{profile?.name || user?.displayName || 'Usuario'}</CardTitle>
                    <CardDescription className="text-xs">Miembro desde {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }) : 'N/A'}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="flex justify-between items-center text-sm p-3 bg-secondary/50 rounded-md">
                     <div className="text-muted-foreground">
                        <span>Membresía: </span>
                        <span className="font-semibold text-foreground">Básica</span>
                     </div>
                     <Button asChild variant="link" className="h-auto p-0 text-xs">
                        <Link href="/memberships">
                            Mejorar Plan
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><BadgeCheck className="text-accent"/>Nivel de Lealtad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="font-bold text-primary text-lg">{levelInfo.name}</p>
                <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{loyaltyPoints} Puntos</span>
                        {levelInfo.nextLevelPoints !== null && <span>{levelInfo.nextLevelPoints}</span>}
                    </div>
                    <Progress value={progress} className="h-2"/>
                    {pointsToNext !== null && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Te faltan {pointsToNext} puntos para el siguiente nivel.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
      
        <div className="space-y-1">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="citas" className="border-none">
                    <AccordionTrigger className="py-2 px-4 font-normal text-sm hover:bg-muted rounded-md hover:no-underline">
                        <Calendar className="mr-3 h-5 w-5" /> Próximas Citas
                    </AccordionTrigger>
                    <AccordionContent className="pl-12 text-muted-foreground text-xs">
                        No tienes citas programadas.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

        <Card className="bg-accent/10 border-accent/20">
          <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4">
              <div className="p-2 bg-accent/20 rounded-full">
                <Lightbulb className="h-5 w-5 text-accent"/>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-sm font-semibold text-accent-foreground">Consejo del día</CardTitle>
                <CardDescription className="text-xs text-accent-foreground/80">
                    Toma 5 minutos al día para practicar respiración profunda y reducir el estrés.
                </CardDescription>
              </div>
          </CardHeader>
        </Card>
    </div>
  );
}
