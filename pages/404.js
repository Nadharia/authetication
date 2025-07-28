import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white px-4 text-center">
      <FaExclamationTriangle className="text-red-500 text-6xl mb-6" />
      <h1 className="text-4xl md:text-5xl font-bold mb-4">404 - Página no encontrada</h1>
      <p className="text-lg text-gray-300 mb-8">
        Uy... Parece que esta página no existe o el enlace está roto.
      </p>
      <Link
        href="/"
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
