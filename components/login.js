// components/Login.jsx
import { useRouter } from "next/router";
import classNames from "classnames";
import { useUser } from "@/components/UserContext";

export function Login({ isActive = true, isLoggedIn }) {
  const router = useRouter();
  const { user, setUser } = useUser();

  const loginClass = classNames(
    "px-4 py-1 rounded text-sm font-medium",
    {
      "bg-red-500 text-white hover:bg-black transition duration-500": isActive,
      "bg-gray-400 text-black cursor-not-allowed": !isActive,
    }
  );

  const handleLoginClick = () => {
    if (!isLoggedIn && isActive) {
      router.push("/");
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
      {user?.username && (
        <span className="text-black font-semibold text-sm">{user.username}</span>
      )}
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-black transition text-sm font-medium"
        title="Cerrar sesión"
      >
        Logout
      </button>
    </div>
  );
}