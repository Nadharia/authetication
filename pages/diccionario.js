import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Diccionario() {
  const router = useRouter();
  const { search } = router.query;
  const [signos, setSignos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Añadido el estado para error

  useEffect(() => {
    const fetchSignos = async () => {
      try {
        setLoading(true);
        setError(null); // Resetear error al iniciar nueva carga

        const url = search
          ? `http://localhost:8080/api/signos?query=${encodeURIComponent(
              search
            )}`
          : "http://localhost:8080/api/signos";

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Formato de datos inválido");
        }

        setSignos(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message); // Establecer el mensaje de error
      } finally {
        setLoading(false);
      }
    };

    fetchSignos();
  }, [search]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.classList.add("hidden");
    const fallback = e.target.nextElementSibling;
    if (fallback) fallback.classList.remove("hidden");
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-96px)] bg-gray-50 flex items-center justify-center">
        <p className="text-rose-700 text-xl">Cargando signos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-96px)] bg-gray-50 flex flex-col items-center justify-center text-red-600">
        <p className="text-xl mb-4">Error al cargar los signos</p>
        <p className="text-sm mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-rose-700 text-white rounded-lg hover:bg-rose-800 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (signos.length === 0) {
    return (
      <div className="min-h-[calc(100vh-96px)] bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-rose-700 text-xl">
          {search
            ? "No se encontraron coincidencias"
            : "No hay signos disponibles"}
        </p>
        <p className="text-gray-500 text-sm">
          {search ? `Para "${search}"` : "La lista está vacía"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-96px)] bg-gray-50 text-gray-900 flex flex-col gap-10 p-6 lg:p-12">
      {/* Encabezado */}
      <div className="relative bg-rose-700 rounded-xl shadow-xl p-6 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Diccionario de LSA
        </h1>
        <p className="text-rose-100 text-center max-w-2xl">
          Explora los signos de la Lengua de Señas Argentina
        </p>
        {search && (
          <span className="block text-lg font-normal mt-2">
            Resultados para: "{search}"
          </span>
        )}
      </div>

      {/* Grid de signos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {signos.map((signo) => (
          <Link key={signo.id} href={`/signo/${signo.palabra}`} passHref>
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden group hover:-translate-y-1">
              {/* Contenedor de imagen */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                {signo.urls?.[0] ? (
                  <>
                    <img
                      src={signo.urls[0]}
                      alt={signo.palabra}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-4xl font-bold hidden bg-gray-100">
                      {signo.palabra.charAt(0).toUpperCase()}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold bg-gray-100">
                    {signo.palabra.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Contenido del card */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-rose-700 font-bold text-lg mb-1 truncate">
                  {signo.palabra}
                </h3>
                <span className="text-amber-600 text-sm mb-2">
                  {signo.categoria}
                </span>
                <div className="flex-1 overflow-hidden">
                  <p className="text-gray-600 text-sm line-clamp-3 group-hover:line-clamp-none group-hover:overflow-y-auto group-hover:max-h-[100px] group-hover:pr-2">
                    {signo.definicion || "Sin descripción disponible"}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
