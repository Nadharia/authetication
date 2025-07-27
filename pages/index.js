import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { loginUser } from "@/components/services/auth";
import { useUser } from "@/components/UserContext";

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

  // profileData tiene: { message, rol }
  // Actualizá contexto con usuario y rol juntos
  setUser({ username, rol: profileData.rol });

  setMessage("Logeado correctamente");
  setError("");

  setTimeout(() => {
    if (profileData.rol === "ADMIN") {
      router.push("/_usuarios");
    } else {
      router.push("/admin");
    }
  }, 100);
} catch (err) {
  setError("Error al logearse");
  setMessage("");
  console.error(err);
}

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Login</h1>
        <form className="flex flex-col gap-4" onSubmit={handleValidation}>
          <label htmlFor="username" className="text-black font-serif">
            Ingrese el usuario:
          </label>
          <input
            id="username"
            type="text"
            placeholder="Usuario"
            ref={userRef}
            className="border border-gray-950 text-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400"
          />

          <label htmlFor="password" className="text-black font-serif">
            Ingrese la contraseña:
          </label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            ref={passwordRef}
            className="border border-gray-950 text-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400"
          />

          <button
            type="submit"
            className="bg-gray-600 text-white py-2 rounded hover:bg-black transition"
          >
            Iniciar sesión
          </button>

          {error && (
            <p className="bg-red-400 text-center shadow w-full p-3 rounded text-white font-semibold">
              {error}
            </p>
          )}
          {message && (
            <p className="bg-green-500 text-center shadow w-full p-3 rounded text-black font-semibold">
              {message}
            </p>
          )}

          <p className="text-sm text-black text-center">
            ¿No tenés cuenta?{" "}
            <Link href="/register" className="text-red-600 font-bold hover:underline">
              Registrate aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
