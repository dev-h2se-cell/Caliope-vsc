'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useAuth from '@/hooks/use-auth';
import { getUserLevel } from '@/lib/user-levels';
import { rewardsData } from '@/lib/rewards-data';
import { CheckCircle, Lock, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Reward } from '@/lib/types';

function RewardCard({ reward, isUnlocked }: { reward: Reward; isUnlocked: boolean }) {
  return (
    <div className={cn("flex items-start gap-4 p-4 border-l-4 rounded-r-md rounded-l-sm transition-all", isUnlocked ? 'bg-card border-accent' : 'bg-muted/50 border-border')}>
        <div className={cn("p-2 rounded-full", isUnlocked ? 'bg-accent/10 text-accent' : 'bg-muted-foreground/10 text-muted-foreground')}>
            {isUnlocked ? <Trophy className="h-6 w-6"/> : <Lock className="h-6 w-6"/>}
        </div>
        <div>
            <h4 className={cn("font-semibold", isUnlocked ? 'text-card-foreground' : 'text-muted-foreground')}>{reward.title}</h4>
            <p className={cn("text-sm", isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/70')}>{reward.description}</p>
        </div>
    </div>
  )
}

export function RewardsDisplay() {
  const { profile } = useAuth();
  const loyaltyPoints = profile?.loyaltyPoints || 0;
  const userLevel = getUserLevel(loyaltyPoints);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">Centro de Recompensas</CardTitle>
        <CardDescription>Estos son los beneficios que has desbloqueado y los que están por venir. ¡Sigue así!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {rewardsData.map((reward) => (
          <RewardCard 
            key={reward.id} 
            reward={reward} 
            isUnlocked={userLevel.level >= reward.level}
          />
        ))}
      </CardContent>
    </Card>
  );
}
