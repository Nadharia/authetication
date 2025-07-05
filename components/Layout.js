import { useEffect, useState } from "react";
import { profile } from "./services/auth";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await profile();
        setUser(data.user);
      } catch (err) {
        console.error("No se pudo obtener el perfil:", err.message);
        setUser(null);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-black">Mi App</h1>
        {user && (
          <p className="text-sm text-gray-600">Hola, {user.email}</p>
        )}
      </header>

      <main className="flex-grow p-4">{children}</main>

      <footer className="bg-gray-200 text-center p-2">
        <p className="text-sm text-black">
          © 2025 - Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
}
