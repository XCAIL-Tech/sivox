import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useAuth() {
  // undefined = cargando, null = no autenticado, User = autenticado
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (u) => setUser(u),
        () => setUser(null) // error callback: Firebase no configurado → sin auth
      );
      return unsubscribe;
    } catch {
      setUser(null);
      return () => {};
    }
  }, []);

  return { user, loading: user === undefined };
}
