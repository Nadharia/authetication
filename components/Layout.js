import { useState } from "react";
import { useUser } from "@/components/UserContext";
import Search from "./Search";
import { Login } from "./login";
import Link from "next/link";


export default function Layout({ children }) {
  const { user, loading } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const adminButtons = (
    <>

     <Link href="/_usuarios" passHref>
  <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800 transition">
   Usuarios
  </button>
</Link>
      <Link href="/logs" passHref>
  <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800 transition">
    Logs
  </button>
</Link>
      <Link href="/register" passHref>
  <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800 transition">
   Registrar usuario
  </button>
</Link>
    </>
  );

  const userButtons = (
    <>
      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 transition">
        Mi Perfil
      </button>
      <button className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-black transition">
        Ajustes
      </button>
    </>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <header className="bg-white shadow p-4 shrink-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-black">Dicciotips</h1>

          {/* Botón hamburguesa para pantallas pequeñas */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded hover:bg-gray-200"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Botones visibles en desktop (md+) */}
          <div className="hidden md:flex gap-2 items-center">
            <Login isActive={true} isLoggedIn={!!user} />
            {user &&
              (user.rol?.toLowerCase() === "admin" ? adminButtons : userButtons)}
          </div>
        </div>

        {/* Menú desplegable hamburguesa */}
        {menuOpen && (
          <nav className="flex flex-col gap-2 md:hidden mt-2">
            <Login isActive={true} isLoggedIn={!!user} />
            {user &&
              (user.rol?.toLowerCase() === "admin" ? adminButtons : userButtons)}
          </nav>
        )}

        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-md px-4">
            <Search />
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-auto">{children}</main>
    </div>
  );
}