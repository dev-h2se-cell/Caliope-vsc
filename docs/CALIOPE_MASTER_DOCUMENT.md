# CALIOPE APP — Documento Maestro Unificado

> **Propósito:** Unificar, sintetizar y preservar TODO el contexto, guías, lecciones y resúmenes del Proyecto **Caliope App** en un **único documento .md**, que sirva como única fuente de verdad.

**Última actualización:** 2025-09-04

---

## 1. Visión y Fundamentos del Proyecto

- **Misión:** Transformar el bienestar y la estética de un lujo a una necesidad vital, garantizando acceso a servicios confiables y de calidad.
- **Propuesta Única de Valor (PUV):** “El Deseo de tu Belleza y Confianza. La excelencia que persigues, la encuentras aquí.”
- **Público Objetivo:**
    - **Cliente Final ("Sofía"):** 30-45 años, urbana, valora la confianza, calidad y comodidad. Busca profesionales verificados y una gestión de citas eficiente.
    - **Profesional Verificado ("Carlos"):** 28-50 años, independiente o PYME. Busca crecimiento, optimización de su agenda y atraer clientes de calidad.

---

## 2. Arquitectura y Stack Tecnológico

Esta sección describe la arquitectura **actual y definitiva** de la aplicación web de Caliope.

- **Framework Principal:** **Next.js con App Router** en un único repositorio (no es un monorepo).
- **Lenguaje:** **TypeScript**.
- **Backend y Base de Datos:** **Firebase**
    - **Autenticación:** Firebase Authentication.
    - **Lógica de Negocio:** Server Actions de Next.js y Cloud Functions for Firebase.
    - **Base de Datos Principal:** Cloud Firestore (NoSQL).
    - **Almacenamiento:** Cloud Storage for Firebase.
- **Componentes UI:** **ShadCN/UI**.
- **Estilos:** **Tailwind CSS**.
- **Iconos:** **`lucide-react`**.

---

## 3. Roadmap de Desarrollo por Fases

El proyecto se desarrolla de forma incremental, siguiendo estas fases:

- **Fase 0 (Core):** Infraestructura, autenticación, perfiles básicos. *(Completada)*
- **Fase 1 (Cliente MVP):** Búsqueda, reserva, pago, reseñas. *(En progreso)*
- **Fase 2 (Profesional MVP):** Registro, perfil/agenda. *(En progreso)*
- **Fase 3 (E-commerce MVP):** Catálogo, carrito, checkout. *(En progreso)*
- **Fase 4 (Fidelización/IA):** Programa de puntos, notificaciones y Asistente de Bienestar. *(En progreso)*
- **Fase 5 (PaaS/B2B2C):** Panel de negocios/CRM básico. *(Pendiente)*
- **Fase 6 (Mejoras/Escalabilidad):** Rendimiento, seguridad avanzada, analíticas. *(Pendiente)*

---

## 4. Guías Operativas y Estándares

### 4.1. Guía de Implementación y Estabilidad (Principios Fundamentales)

1.  **La Estabilidad es la Prioridad #1:** Ninguna nueva funcionalidad debe comprometer el arranque o el funcionamiento básico de la aplicación. Componentes críticos (layout, header, logo) deben ser estáticos.
2.  **El Acceso del Usuario es Innegociable:** Los flujos de autenticación deben ser robustos y funcionar perfectamente en `DEMO_MODE`.
3.  **Aislar Problemas de Configuración:** Los errores de credenciales (`PERMISSION_DENIED`) son problemas de entorno (`.env`). La solución es usar y mejorar el `DEMO_MODE`, no modificar el código de la aplicación.
4.  **Diagnóstico Metódico:** No repetir soluciones fallidas. Ante un error, ampliar el foco del diagnóstico más allá del archivo que reporta el error e investigar sus dependencias.

### 4.2. Guía de Construcción de UI

1.  **Diseñar para el Modo de Demostración:** Todos los componentes y páginas deben funcionar primero en `DEMO_MODE=true`, usando datos locales de `src/lib/*-data.ts`.
2.  **Permisos Claros y Seguros:** Las páginas protegidas deben usar el hook `useAuth`, mostrar un `LoadingSpinner` durante la carga y un componente de `Acceso Denegado` explícito si el usuario no tiene permisos.
3.  **Guía de Estilo:**
    - **Colores:** Usar exclusivamente las variables de Tailwind CSS definidas en `src/app/globals.css`.
        - `primary`: Azul profundo (`#34388D`)
        - `background`: Azul muy claro (`#F5F5F5`)
        - `accent`: Verde apagado (`#8ECC98`)
    - **Tipografía:** `PT Sans`.
    - **Imágenes:** Usar `https://placehold.co/<width>x<height>.png` para placeholders. El logo es estático.
4.  **Manejo de Datos:** Las páginas deben ser `'use client'` y obtener sus datos a través de las `Server Actions` definidas en `src/app/**/actions.ts`.

### 4.3. Lecciones Aprendidas (Errores a No Repetir)

- **No priorizar funcionalidad sobre estabilidad:** Un logo dinámico que rompía la app fue el error original.
- **No crear dependencias frágiles:** Componentes críticos no deben depender de llamadas asíncronas.
- **No aplicar soluciones superficiales:** Atacar la causa raíz (arquitectura frágil) en lugar de los síntomas (logo roto).
- **No ignorar el entorno de desarrollo:** Diseñar para la resiliencia, asumiendo que las credenciales pueden faltar (`DEMO_MODE`).
- **No caer en el diagnóstico en túnel:** Si un arreglo no funciona, el diagnóstico es incorrecto. Ampliar la búsqueda del error.

### 4.4. Guía de Control de Calidad (QA)

- **Entorno de Staging:** Debe ser un reflejo fiel de producción.
- **Casos de Prueba:** Deben cubrir todos los requisitos funcionales, no funcionales y flujos de usuario.
- **Pruebas Automatizadas:** Son obligatorias en el pipeline de CI/CD (Unitarias, Integración, E2E).
- **Pruebas Manuales:** Enfocadas en usabilidad, pruebas exploratorias y de regresión.
- **Pruebas Específicas:** Realizar pruebas de Carga, Estrés y Seguridad (Vulnerabilidades, Pen Testing) antes de salir a producción.
- **Bug Tracking:** Usar una herramienta formal (Jira, Trello) con reportes detallados.

### 4.5. Checklist de Pull Request (Resumen)

Un PR no se aprueba si no cumple con lo siguiente:
- [ ] Build y arranque OK.
- [ ] Autenticación en `DEMO_MODE` operativa.
- [ ] Permisos en rutas protegidas funcionan y muestran "Acceso Denegado".
- [ ] UI global es estática y no depende de datos asíncronos.
- [ ] El desarrollo se hizo priorizando el `DEMO_MODE`.
- [ ] No se repiten errores de las "Lecciones Aprendidas".

---

## 5. Requisitos Funcionales Clave

- **Asistente de Bienestar:** Genera recomendaciones de servicios basadas en las preferencias del usuario.
- **Gestión de Preferencias:** Permite a los usuarios guardar y ver sus preferencias.
- **Historial:** Muestra el historial de servicios y recomendaciones.
- **Plataforma de Profesionales:** Gestión de perfil, agenda y comunicación con clientes.
- **E-commerce:** Catálogo de productos, carrito y checkout.
- **Programa de Fidelización:** Acumulación y canje de puntos.
