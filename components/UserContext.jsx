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
    const publicPaths = ["/", "/dashboard", "/404", "/login","/logout"];
    const pathIsPublic = publicPaths.includes(router.pathname);

    if (!loading && !user && !pathIsPublic) {
      router.replace("/404"); 
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
