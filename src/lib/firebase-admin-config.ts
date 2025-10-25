
/**
 * @fileoverview Configuración y inicialización segura del SDK de Admin de Firebase.
 * Este archivo es SOLO para uso del lado del servidor.
 */

import admin from 'firebase-admin';

let firebaseAdminApp: admin.app.App | null = null;
let initializationError: Error | null = null;
let initialized = false;

/**
 * Inicializa la app de administrador de Firebase de forma segura y perezosa (lazy).
 * Lee las credenciales desde una variable de entorno.
 * Este patrón asegura que la inicialización ocurra solo una vez.
 * @returns La instancia de la app de Firebase Admin o null si falla.
 */
function initializeAdmin() {
  if (initialized) {
    if (initializationError) {
      // Si ya falló una vez, no reintentes para evitar logs repetitivos.
      return null;
    }
    return firebaseAdminApp;
  }
  initialized = true;

  // Si el modo demo está explícitamente activado, no intentamos inicializar.
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    const demoModeMsg = 'BACKEND: Modo Demo ACTIVADO. No se conectará a Firebase Admin.';
    initializationError = new Error(demoModeMsg);
    console.log(demoModeMsg);
    return null;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (admin.apps.length) {
    firebaseAdminApp = admin.app();
  } else if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);

      // SOLUCIÓN ROBUSTA: El error "Failed to parse private key" ocurre casi siempre
      // porque los saltos de línea (\n) en la clave privada se escapan como (\\n) en el .env.
      // Reemplazamos explícitamente `\\n` por `\n` para asegurar el formato correcto.
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

      firebaseAdminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK inicializado correctamente.');
    } catch (error: any) {
      initializationError = error;
      console.error(
        'ERROR CRÍTICO: Falló la inicialización de Firebase Admin. ' +
        '1. Verifica que la variable de entorno FIREBASE_SERVICE_ACCOUNT en tu .env.local sea un JSON válido. ' +
        '2. Asegúrate de haber copiado el contenido COMPLETO del archivo de la cuenta de servicio. ' +
        'Las operaciones de backend fallarán.',
        error.message
      );
    }
  } else {
    const errorMsg = 'ERROR CRÍTICO: La variable de entorno FIREBASE_SERVICE_ACCOUNT no está definida, pero el modo demo está desactivado. El SDK de Administrador no se pudo inicializar. Las operaciones de backend (como crear perfiles de usuario en DB) fallarán.';
    initializationError = new Error(errorMsg);
    console.error(errorMsg);
  }
  
  return firebaseAdminApp;
}

/**
 * Obtiene la instancia de la base de datos de Firestore del lado del servidor.
 * @returns La instancia de Firestore o null si la inicialización falla.
 */
export function getAdminDb(): admin.firestore.Firestore | null {
  const app = initializeAdmin();
  return app ? app.firestore() : null;
}

/**
 * Obtiene la instancia de Auth del lado del servidor.
 * @returns La instancia de Auth o null si la inicialización falla.
 */
export function getAdminAuth(): admin.auth.Auth | null {
  const app = initializeAdmin();
  return app ? app.auth() : null;
}
