import React, { useRef, useState, useEffect } from "react";
import { registerUser } from "@/components/services/auth";
import { useUser } from "@/components/UserContext";
import { useRouter } from "next/router";
import { HiOutlineMail, HiLockClosed, HiArrowLeft, HiUser } from "react-icons/hi";
import { ImSpinner8 } from "react-icons/im";

export default function Register() {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.rol?.toLowerCase() !== "admin")) {
      router.push("/");
    }
  }, [loading, user, router]);

  const handleValidation = async (e) => {
    e.preventDefault();

    const username = usernameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    const confirm = passwordConfirmRef.current.value.trim();

    if (!username || !/^[a-zA-Z0-9._-]+$/.test(username)) {
      setError("Usuario inválido");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email inválido");
      return;
    }
    if (!password) {
      setError("Contraseña vacía");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
  await registerUser({ username, email, password });

  setMessage("Usuario registrado correctamente");
  // Limpiar inputs
  usernameRef.current.value = "";
  emailRef.current.value = "";
  passwordRef.current.value = "";
  passwordConfirmRef.current.value = "";

  // Mostrar mensaje 2 segundos y luego redirigir
  setTimeout(() => {
    setMessage("");
    router.push("/_usuarios");
  }, 2000);
} catch (err) {
  setError(err.message || "Error en el registro");
} finally {
  setIsLoading(false);
}}


  if (loading || !user || user.rol?.toLowerCase() !== "admin") {
    return <p className="text-center p-6 text-black">Cargando o no autorizado...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 relative">
        <button
          onClick={() => router.push("/_usuarios")}
          className="flex items-center gap-2 text-red-700 hover:text-red-900 font-semibold mb-6 transition"
        >
          <HiArrowLeft size={20} />
          Volver
        </button>

        <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-900">Registrar Usuario</h1>

        <form className="flex flex-col gap-6" onSubmit={handleValidation} noValidate>
          <label className="relative block">
            <HiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Usuario"
              ref={usernameRef}
              className="pl-10 w-full border border-gray-300 rounded-lg py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
              required
            />
          </label>

          <label className="relative block">
            <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              ref={emailRef}
              className="pl-10 w-full border border-gray-300 rounded-lg py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
              required
            />
          </label>

          <label className="relative block">
            <HiLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Contraseña"
              ref={passwordRef}
              className="pl-10 w-full border border-gray-300 rounded-lg py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
              required
            />
          </label>

          <label className="relative block">
            <HiLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              ref={passwordConfirmRef}
              className="pl-10 w-full border border-gray-300 rounded-lg py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3 rounded-lg shadow-md transition flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <ImSpinner8 className="animate-spin" size={20} />
                Registrando...
              </>
            ) : (
              "Registrar"
            )}
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
