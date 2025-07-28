// components/Spinner.js
import { FaSpinner } from "react-icons/fa";

export default function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <FaSpinner className="animate-spin text-4xl text-red-500" />
      <p className="ml-3 text-lg">Cargando...</p>
    </div>
  );
}
