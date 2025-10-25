import type { Membership } from './types';

export const membershipPlans: Membership[] = [
  {
    id: 'plan-essential',
    name: 'Esencial',
    price: 49000,
    priceDescription: '/mes',
    description: 'Ideal para empezar tu viaje de bienestar con beneficios clave.',
    features: [
      'Descuento del 5% en todos los servicios',
      'Acceso a artículos y guías de bienestar',
      'Acumulación de puntos de lealtad (1x)',
      'Soporte por correo electrónico',
    ],
  },
  {
    id: 'plan-plus',
    name: 'Plus',
    price: 89000,
    priceDescription: '/mes',
    description: 'Maximiza tus beneficios y acelera tu progreso de bienestar.',
    features: [
      'Descuento del 10% en todos los servicios',
      'Descuento del 5% en productos',
      'Acceso a meditaciones guiadas exclusivas',
      'Acumulación de puntos de lealtad (1.5x)',
      'Soporte prioritario por chat',
    ],
    isPopular: true,
  },
  {
    id: 'plan-premium',
    name: 'Premium',
    price: 149000,
    priceDescription: '/mes',
    description: 'La experiencia de bienestar definitiva con acceso total.',
    features: [
      'Descuento del 15% en todos los servicios',
      'Descuento del 10% en productos',
      '1 servicio de relajación gratuito al mes',
      'Acceso a talleres y eventos exclusivos',
      'Acumulación de puntos de lealtad (2x)',
      'Concierge de bienestar personal',
    ],
  },
];
