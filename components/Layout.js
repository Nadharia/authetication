import { useEffect, useState } from "react";
import { profile } from "./services/auth";
import Search from "./Search";
import Login from "./login";

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
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <header className="bg-white shadow p-4 shrink-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-black">Dicciotips</h1>
          <Login isActive={true} />
        </div>
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
