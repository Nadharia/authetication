import { useUser } from "@/components/UserContext";
import Search from "./Search";
import Login from "./login";

export default function Layout({ children }) {
  const { user, loading } = useUser();

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <header className="bg-white shadow p-4 shrink-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-black">Dicciotips</h1>
          {/* Pasamos el estado user para que Login controle el botón */}
          <Login isActive={true} isLoggedIn={!!user} />
        </div>
        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-md px-4">
            <Search />
          </div>
        </div>
        {user && (
          <p className="text-black text-center">
            Hola, {user.username} - Rol: {user.rol}
          </p>
        )}
      </header>

      <main className="flex-grow overflow-auto">{children}</main>
    </div>
  );
}
