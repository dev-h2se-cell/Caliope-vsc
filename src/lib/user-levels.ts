/**
 * @fileoverview Lógica para el sistema de niveles de fidelidad.
 */

import { Progress } from "@/components/ui/progress";

export type UserLevel = {
    level: number;
    name: string;
    minPoints: number;
    nextLevelPoints: number | null;
};

const levels: UserLevel[] = [
    { level: 1, name: "Principiante del Bienestar", minPoints: 0, nextLevelPoints: 100 },
    { level: 2, name: "Entusiasta del Bienestar", minPoints: 100, nextLevelPoints: 300 },
    { level: 3, name: "Experto del Bienestar", minPoints: 300, nextLevelPoints: 700 },
    { level: 4, name: "Maestro del Bienestar", minPoints: 700, nextLevelPoints: 1500 },
    { level: 5, name: "Gurú del Bienestar", minPoints: 1500, nextLevelPoints: null },
];

/**
 * Obtiene el nivel de un usuario basado en sus puntos de fidelidad.
 * @param loyaltyPoints Los puntos de fidelidad del usuario.
 * @returns El objeto de nivel correspondiente al usuario.
 */
export function getUserLevel(loyaltyPoints: number): UserLevel {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (loyaltyPoints >= levels[i].minPoints) {
      return levels[i];
    }
  }
  return levels[0];
}


/**
 * Calcula el progreso del usuario hacia el siguiente nivel.
 * @param loyaltyPoints Los puntos de fidelidad actuales del usuario.
 * @param currentLevel El nivel actual del usuario.
 * @returns Un objeto con el progreso en porcentaje, y los puntos que faltan para el siguiente nivel.
 */
export function getProgressToNextLevel(loyaltyPoints: number, currentLevel: UserLevel): { progress: number; pointsToNext: number | null; } {
    if (currentLevel.nextLevelPoints === null) {
        return { progress: 100, pointsToNext: null };
    }

    const pointsInCurrentLevel = currentLevel.nextLevelPoints - currentLevel.minPoints;
    const userProgressInLevel = loyaltyPoints - currentLevel.minPoints;
    
    const progress = Math.min(Math.floor((userProgressInLevel / pointsInCurrentLevel) * 100), 100);
    const pointsToNext = currentLevel.nextLevelPoints - loyaltyPoints;

    return { progress, pointsToNext };
}