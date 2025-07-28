import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { loginUser } from "@/components/services/auth";
import { useUser } from "@/components/UserContext";
import { HiUser, HiLockClosed } from "react-icons/hi";

export default function Home() {
  const userRef = useRef();
  const passwordRef = useRef();

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();
  const { setUser } = useUser();

  const handleValidation = async (e) => {
    e.preventDefault();

    const username = userRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    if (!username) {
      setError("El usuario no puede estar vacío");
      setMessage("");
      return;
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
      setError("Solo se permiten letras, números, puntos, guiones y guiones bajos");
      setMessage("");
      return;
    }
    if (!password) {
      setError("La contraseña no puede estar vacía");
      setMessage("");
      return;
    }

    try {
  const profileData = await loginUser({ username, password });

  setUser({ username, rol: profileData.rol });

  setMessage("Logeado correctamente");
  setError("");

  setTimeout(() => {
    if (profileData.rol === "ADMIN") {
      router.push("/_usuarios");
    } else {
      router.push("/dashboard");
    }
  }, 100);
} catch (err) {
  // Mostrar el mensaje real del error si existe, sino un mensaje genérico
  setError(err.message || "Error al logearse");
  setMessage("");
  console.error(err);
}
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 relative">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-red-700">Iniciar Sesión</h1>

        <form className="flex flex-col gap-6" onSubmit={handleValidation} noValidate>
          {/* Usuario input */}
          <label className="relative block">
            <span className="sr-only">Usuario</span>
            <HiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Usuario"
              ref={userRef}
              className="pl-10 w-full border border-gray-300 rounded-lg py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
              required
            />
          </label>

          {/* Contraseña input */}
          <label className="relative block">
            <span className="sr-only">Contraseña</span>
            <HiLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Contraseña"
              ref={passwordRef}
              className="pl-10 w-full border border-gray-300 rounded-lg py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            Iniciar sesión
          </button>
        </form>

        {error && (
          <p className="mt-6 bg-red-500 text-white rounded-md p-3 text-center font-semibold shadow">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-6 bg-green-400 text-gray-900 rounded-md p-3 text-center font-semibold shadow">
            {message}
          </p>
        )}

        
      </div>
    </div>
  );
}
