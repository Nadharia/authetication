import { useRouter } from "next/router";
import classNames from "classnames";
import { useUser } from "@/components/UserContext";

export default function Login({ isActive = true, isLoggedIn }) {
  const router = useRouter();
  const { user, setUser } = useUser();

  const loginClass = classNames(
    "h-8 px-4 rounded text-xs",
    {
      "bg-red-500 text-white hover:bg-black transition duration-500": isActive,
      "bg-gray-400 text-black cursor-not-allowed": !isActive,
    }
  );

  const handleLoginClick = () => {
    if (!isLoggedIn && isActive) {
      router.push("/login");
    }
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
        title="Ir a login"
      >
        Iniciar Sesión
      </button>
    );
  }

  // Si está logueado mostramos nombre y botón logout
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-black">
        Hola, {user?.username}
      </span>
      <button
        onClick={handleLogout}
        className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-black transition text-xs"
        title="Cerrar sesión"
      >
        Logout
      </button>
    </div>
  );
}
