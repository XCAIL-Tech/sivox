import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
  type UserCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

function createGoogleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

export async function signInWithGoogle(
  defaultCountry = "AR"
): Promise<UserCredential> {
  const result = await signInWithPopup(auth, createGoogleProvider());

  const userRef = doc(db, "users", result.user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await createUserDocument(result.user, {
      email: result.user.email ?? "",
      name: result.user.displayName ?? "",
      country: defaultCountry,
    });
  }

  return result;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: unknown) {
    const code = (error as { code?: string }).code ?? "";
    throw new Error(getAuthErrorMessage(code));
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<UserCredential> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocument(credential.user, {
      email,
      name,
      country: "AR",
    });
    return credential;
  } catch (error: unknown) {
    const code = (error as { code?: string }).code ?? "";
    throw new Error(getAuthErrorMessage(code));
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
    if (typeof window !== "undefined") {
      window.localStorage.clear();
      window.sessionStorage.clear();
    }
  } catch {
    // continúa aunque falle
  } finally {
    window.location.replace("/");
  }
}

async function createUserDocument(
  user: User,
  data: { email: string; name: string; country: string }
): Promise<void> {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    email: data.email,
    name: data.name,
    country: data.country,
    photoURL: user.photoURL ?? null,
    profile_completed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

function getAuthErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    "auth/email-already-in-use": "Este email ya está registrado",
    "auth/invalid-email": "Email inválido",
    "auth/invalid-credential": "Email o contraseña incorrectos",
    "auth/wrong-password": "Contraseña incorrecta",
    "auth/user-not-found": "No existe una cuenta con este email",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
    "auth/too-many-requests": "Demasiados intentos. Intentá más tarde",
    "auth/user-disabled": "Esta cuenta fue deshabilitada",
    "auth/popup-closed-by-user": "Ventana cerrada por el usuario",
    "auth/popup-blocked": "Popup bloqueado por el navegador. Permití los popups e intentá de nuevo",
    "auth/network-request-failed": "Error de red. Verificá tu conexión",
  };
  return messages[code] ?? "Error de autenticación. Intentá de nuevo.";
}
