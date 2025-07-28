import { useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";
import { useUser } from "@/components/UserContext";
import Search from "./Search";
import Link from "next/link";

export default function Layout({ children }) {
  const { user, loading, setUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const Login = ({ isActive = true, isLoggedIn }) => {
    const loginClass = classNames(
      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
      {
        "bg-red-600 text-white hover:bg-black hover:shadow-md": isActive,
        "bg-gray-300 text-gray-500 cursor-not-allowed": !isActive,
      }
    );

    const handleLoginClick = () => {
      if (!isLoggedIn && isActive) router.push("/");
    };

    const handleLogout = async () => {
      try {
        const res = await fetch("http://localhost:8080/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al desloguear");
        setUser(null);
        router.push("/");
      } catch (error) {
        console.error(error);
      }
    };

    if (!isLoggedIn) {
      return (
        <button
          onClick={handleLoginClick}
          className={loginClass}
          disabled={!isActive}
        >
          Iniciar Sesión
        </button>
      );
    }

    return (
      <div className="flex items-center gap-4">
        {user?.username && (
          <span className="bg-gray-200 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
            {user.username}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-black hover:shadow-md text-sm font-medium transition-all duration-200"
        >
          Cerrar Sesión
        </button>
      </div>
    );
  };

  const Button = ({ href, label }) => (
    <Link href={href} passHref>
      <button className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-black hover:-translate-y-0.5 hover:shadow-md whitespace-nowrap">
        {label}
      </button>
    </Link>
  );

  const adminButtons = (
    <>
      <Button href="/_usuarios" label="Usuarios" />
      <Button href="/logs" label="Logs" />
      <Button href="/register" label="Registrar Usuario" />
      <Button href="/signo/crear" label="Crear Signo" />
      <Button href="/diccionario" label="Diccionario" />
    </>
  );

  const userButtons = (
    <>
      <Button href="/signo/crear" label="Crear Signo" />
      <Button href="/diccionario" label="Diccionario" />
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-black shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" passHref>
              <h1 className="text-2xl font-bold text-red-600 cursor-pointer hover:text-white transition-colors duration-200">
                Dicciotips
              </h1>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              {user &&
                (user.rol?.toLowerCase() === "admin" ? adminButtons : userButtons)}
              <Login isActive={true} isLoggedIn={!!user} />
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-white transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              <div className="flex flex-col space-y-3">
                {user &&
                  (user.rol?.toLowerCase() === "admin"
                    ? adminButtons
                    : userButtons)}
              </div>
              <div className="pt-2">
                <Login isActive={true} isLoggedIn={!!user} />
              </div>
            </div>
          )}

          <div className="mt-4 w-full">
            <div className="max-w-xl mx-auto">
              <Search />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
