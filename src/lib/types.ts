
/**
 * @fileoverview Tipos de datos principales para la aplicación Caliope.
 * Define los esquemas para Usuarios, Profesionales, Servicios, Citas y Reseñas.
 */
import type { Timestamp } from 'firebase-admin/firestore';

/**
 * Representa a un Usuario Cliente en el sistema.
 */
export interface UserProfile {
  uid?: string;
  email: string;
  name: string;
  createdAt: string; // ISO 8601 date string
  loyaltyPoints: number;
  isAdmin: boolean;
  isProfessional: boolean;
  phone?: string;
  address?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'; // Campo opcional
  membershipId?: string; // ID del plan de membresía
};

/**
 * Representa a un Profesional del Bienestar verificado en el sistema.
 */
export type Professional = {
  id: string; // Corresponde al UID de Firebase Auth
  email: string;
  name: string;
  bio: string;
  specialties: string[]; // Array de especialidades
  profileImageUrl: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  createdAt: string; // Cadena de fecha ISO 8601
};


/**
 * Representa un servicio de bienestar que pueden ofrecen los profesionales.
 * Este es el tipo principal utilizado para las recomendaciones.
 */
export type WellnessService = {
  id: string; // Identificador único del servicio (ej: 'srv-001')
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  rating: number; // Calificación promedio (ej: 4.7)
  reviewCount: number; // Número de reseñas (ej: 132)
  duration: number; // en minutos
  aiHint?: string; // Pista para la generación de imágenes por IA
  createdAt: string;
};

/**
 * Representa un producto de bienestar a la venta en el e-commerce.
 */
export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  aiHint?: string;
  createdAt: string;
};

/**
 * Tipo de unión para manejar recomendaciones de servicios o productos.
 */
export type RecommendationItem = (WellnessService & { type: 'service' }) | (Product & { type: 'product' });

/**
 * Representa la estructura de datos para un producto al ser subido masivamente.
 * Omite campos generados automáticamente como id, rating y reviewCount.
 */
export type ProductUpload = Omit<Product, 'id' | 'rating' | 'reviewCount' | 'createdAt'>;

/**
 * Representa la estructura de datos para un servicio al ser subido masivamente.
 */
export type WellnessServiceUpload = Omit<WellnessService, 'id' | 'rating' | 'reviewCount' | 'createdAt'>;


/**
 * Representa un artículo dentro del carrito de compras.
 */
export type CartItem = {
  product: Product;
  quantity: number;
};


/**
 * Representa una cita reservada por un Usuario con un Profesional.
 */
export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  appointmentDate: string; // ISO 8601 string for client
  status: 'scheduled' | 'completed' | 'cancelled';
  price: number;
  createdAt: string; // ISO 8601 string for client
}

/**
 * Representa una reseña dejada por un Usuario para un servicio/cita completado.
 */
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatarFallback: string;
  rating: number;
  comment: string;
  date: string; // ISO 8601 string for client
  targetId: string;
  targetType: 'service' | 'product' | 'professional';
}

/**
 * Representa una línea de producto en el carrito.
 */
export type CartLineItem = {
  product: Product;
  quantity: number;
};

/**
 * Representa una recompensa o beneficio que un usuario desbloquea al alcanzar un nivel.
 */
export type Reward = {
  id: string;
  level: number; // Nivel requerido para desbloquear
  title: string;
  description: string;
};

/**
 * Representa un plan de membresía de Caliope.
 */
export type Membership = {
  id: string;
  name: string;
  price: number;
  priceDescription: string; // ej: "/mes" o "/año"
  description: string;
  features: string[];
  isPopular?: boolean;
};

    
