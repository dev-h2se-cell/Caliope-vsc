
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, isFirebaseClientConfigured } from '@/lib/firebase-config';
import { getFirestore, doc, getDoc, setDoc, DocumentData } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { handleGoogleSignInAction } from '@/app/actions';

// La fuente de verdad para el modo demo es la variable de entorno.
const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

const mockUser: User = {
    uid: 'demo-user-123',
    email: 'demo@caliope.com',
    displayName: 'Usuario Demo',
    emailVerified: true,
    isAnonymous: false,
    phoneNumber: null,
    photoURL: 'https://placehold.co/100x100.png',
    providerId: 'password',
    tenantId: null,
    metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString(),
    },
    providerData: [],
    refreshToken: 'mock-refresh-token',
    delete: async () => {},
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({ token: 'mock-token', claims: { isAdmin: true, isProfessional: true }, authTime: '', expirationTime: '', issuedAtTime: '', signInProvider: null, signInSecondFactor: null }),
    reload: async () => {},
    toJSON: () => ({}),
};

export interface UserProfile extends DocumentData {
  uid?: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  isProfessional?: boolean;
  loyaltyPoints?: number;
  phone?: string;
  address?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'; // Campo opcional
  membershipId?: string;
}

const mockProfile: UserProfile = {
  uid: 'demo-user-123',
  name: 'Usuario Demo Admin',
  email: 'demo@caliope.com',
  isAdmin: true,
  isProfessional: true,
  loyaltyPoints: 125,
  phone: '3001234567',
  address: 'Calle Falsa 123, Bogotá',
};

interface AuthState {
  user: User | null | undefined;
  profile: UserProfile | null | undefined;
  loading: boolean;
  googleLoading: boolean; // Nuevo estado para la carga de Google
  isDemo: boolean;
  isAdmin: boolean;
  isProfessional: boolean;
  fetchProfile: (user: User) => Promise<void>;
  signInWithGoogle: () => Promise<void>; // Nueva función
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: undefined,
    profile: undefined,
    loading: !IS_DEMO_MODE,
    googleLoading: false,
    isDemo: IS_DEMO_MODE,
    isAdmin: IS_DEMO_MODE ? mockProfile.isAdmin ?? false : false,
    isProfessional: IS_DEMO_MODE ? mockProfile.isProfessional ?? false : false,
    fetchProfile: async () => {},
    signInWithGoogle: async () => {},
  });
  
  const { toast } = useToast();
  const router = useRouter();

  const fetchProfile = useCallback(async (user: User) => {
    if (!auth) return;
    const db = getFirestore(auth.app);
    const userDocRef = doc(db, 'users', user.uid);
    
    try {
        const docSnap = await getDoc(userDocRef);
        let userProfile: UserProfile;
        
        if (docSnap.exists()) {
            userProfile = { uid: docSnap.id, ...docSnap.data() } as UserProfile;
        } else {
            // Si el perfil no existe, creamos uno básico en el estado del cliente
            // para evitar errores y mostrar la información disponible de inmediato.
            userProfile = {
                uid: user.uid,
                name: user.displayName || 'Nuevo Usuario',
                email: user.email || '',
                loyaltyPoints: 0,
                isAdmin: false,
                isProfessional: false,
                createdAt: user.metadata.creationTime || new Date().toISOString()
            };
        }
        
        setAuthState(prevState => ({
            ...prevState,
            user,
            profile: userProfile,
            loading: false,
            isAdmin: userProfile.isAdmin || false,
            isProfessional: userProfile.isProfessional || false,
        }));

    } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
            title: "Error al cargar el perfil",
            description: "No se pudo obtener la información de tu perfil.",
            variant: "destructive"
        });
        setAuthState(prevState => ({
            ...prevState,
            user,
            profile: null,
            loading: false
        }));
    }
  }, [toast]);

  const signInWithGoogle = async () => {
    setAuthState(prevState => ({ ...prevState, googleLoading: true }));
    const provider = new GoogleAuthProvider();
    try {
      if (!auth) {
        toast({ title: 'Error de configuración', description: 'Firebase Auth no está inicializado.', variant: 'destructive' });
        setAuthState(prevState => ({ ...prevState, googleLoading: false }));
        return;
      }
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const backendResult = await handleGoogleSignInAction({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
      });

      if (!backendResult.success) {
        if ((backendResult as any).error?.includes('La base de datos de administrador no está inicializada')) {
            console.warn('Backend no inicializado. Se procede sin creación de perfil en DB (entorno de desarrollo).');
            router.push('/profile');
            return;
        }
        await auth.signOut();
        throw new Error((backendResult as any).error || 'Error en el servidor al procesar el inicio de sesión.');
      }

      toast({ title: '¡Éxito!', description: 'Has iniciado sesión correctamente con Google.' });
      router.push('/profile');

    } catch (error: any) {
      console.error("Error en el inicio de sesión con Google:", error);
      let title = 'Error con Google';
      let description = "No se pudo completar el inicio de sesión con Google.";

      if (error.code === 'auth/unauthorized-domain') {
          title = 'Dominio no autorizado';
          description = `Este dominio no está autorizado. Añade "${window.location.hostname}" a la lista de dominios autorizados en la consola de Firebase.`;
      } else if (error.code === 'auth/popup-closed-by-user') {
          title = 'Inicio de sesión cancelado';
          description = "Has cerrado la ventana de inicio de sesión antes de completar el proceso.";
      } else if (error.code === 'auth/popup-blocked') {
          title = 'Ventana emergente bloqueada';
          description = "El navegador bloqueó la ventana de Google. Por favor, habilita las ventanas emergentes para este sitio.";
      } else if (error.message) {
          description = error.message;
      }
      
      toast({ title: title, description: description, variant: 'destructive', duration: 9000 });
    } finally {
      setAuthState(prevState => ({ ...prevState, googleLoading: false }));
    }
  };

  useEffect(() => {
    if (IS_DEMO_MODE) {
        setAuthState(prevState => ({
          ...prevState,
          user: mockUser,
          profile: mockProfile,
          loading: false
        }));
        return;
    }
    if (!isFirebaseClientConfigured || !auth) {
        setAuthState(prevState => ({ ...prevState, loading: false, user: null, profile: null }));
        return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
            setAuthState(prevState => ({ ...prevState, loading: true }));
            fetchProfile(user);
        } else {
            setAuthState(prevState => ({ ...prevState, user: null, profile: null, loading: false, isAdmin: false, isProfessional: false, isDemo: false }));
        }
    });

    return () => unsubscribeAuth();
  }, [fetchProfile]);
  
  const value = { ...authState, fetchProfile, signInWithGoogle };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
