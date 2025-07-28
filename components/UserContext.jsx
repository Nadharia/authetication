import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { profile } from "./services/auth";
import Spinner from "./Spinner";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await profile(); // { username, rol }
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (loading) return; // espera que cargue el user

    // Define rutas públicas donde se permite usuario null (redirigir a /)
    const publicPaths = ["/", "/dashboard", "/404", "/logout", "/diccionario"];

    // Define rutas privadas donde usuario debe existir, sino 404
    const privatePaths = ["/_usuarios", "/logs", "/register", "/crear","/signo/signos",];

    const path = router.pathname;
    const isPublic = publicPaths.includes(path);
    const isPrivate = privatePaths.includes(path);

    if (!user) {
      if (isPublic) {
        // Usuario no logueado en ruta pública → redirigir a "/"
        if (path !== "/") router.replace("/");
      } else if (isPrivate) {
        // Usuario no logueado en ruta privada → 404
        router.replace("/404");
      } else {
        // Rutas no definidas → 404
        router.replace("/404");
      }
    }
  }, [loading, user, router]);

  if (loading) return <Spinner />;

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
