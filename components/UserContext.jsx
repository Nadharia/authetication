import { createContext, useContext, useState, useEffect } from "react";
import { profile } from "./services/auth"; // ajusta la ruta si hace falta

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await profile(); 
        setUser(data.user); 
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}


export function useUser() {
  return useContext(UserContext);
}
