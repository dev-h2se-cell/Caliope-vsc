
'use server';

import { wellnessServices } from '@/lib/wellness-services-data';
import { wellnessProducts } from '@/lib/products-data';
import type { RecommendationItem } from '@/lib/types';

/**
 * Simula la obtención de recomendaciones de bienestar basadas en las preferencias del usuario.
 * Ahora busca tanto en servicios como en productos.
 * @param preferences Un string con las preferencias del usuario.
 * @returns Una promesa que resuelve a un array de items recomendados (servicios o productos).
 */
export async function getConciergeRecommendations(
  preferences: string
): Promise<RecommendationItem[]> {
  console.log(`CONCIERGE: Buscando recomendaciones para: "${preferences}"`);

  // Simula un pequeño retraso de red para que el loader sea visible.
  await new Promise(resolve => setTimeout(resolve, 750));

  if (!preferences.trim()) {
    return [];
  }

  const keywords = preferences.toLowerCase().split(/\s+|\,/).filter(Boolean);
  if (keywords.length === 0) {
    return [];
  }

  const recommendedServices = wellnessServices
    .filter(service => {
      const serviceText = `${service.name.toLowerCase()} ${service.description.toLowerCase()} ${service.category.toLowerCase()}`;
      return keywords.some(keyword => serviceText.includes(keyword));
    })
    .map(service => ({ ...service, type: 'service' as const }));

  const recommendedProducts = wellnessProducts
    .filter(product => {
        const productText = `${product.name.toLowerCase()} ${product.description.toLowerCase()} ${product.category.toLowerCase()}`;
        return keywords.some(keyword => productText.includes(keyword));
    })
    .map(product => ({...product, type: 'product' as const }));

  const allRecommendations: RecommendationItem[] = [...recommendedServices, ...recommendedProducts];
  
  // Mezclar y limitar los resultados para variedad
  const shuffledRecommendations = allRecommendations.sort(() => 0.5 - Math.random());

  console.log(`CONCIERGE: Encontradas ${shuffledRecommendations.length} recomendaciones.`);

  // Limita los resultados para no saturar la UI
  return shuffledRecommendations.slice(0, 6);
}
