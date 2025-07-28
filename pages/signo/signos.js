import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

export default function SignosList() {
  const [signos, setSignos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSigno, setCurrentSigno] = useState(null);
  const router = useRouter();

  // Cargar signos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/signos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al cargar los signos");

        const data = await res.json();
        setSignos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Eliminar signo
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/signos/${currentSigno.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Error al eliminar");
      setSignos(signos.filter((s) => s.id !== currentSigno.id));
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-96px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-96px)] flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded max-w-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-96px)] bg-gray-50 p-6 lg:p-12">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-rose-700">
            Lista de Signos
          </h1>
          <Link href="/signo/crear" passHref>
            <button className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Crear Nuevo Signo
            </button>
          </Link>
        </div>

        <div className="space-y-4">
          {signos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay signos registrados
            </div>
          ) : (
            signos.map((signo) => (
              <div
                key={signo.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  {/* Información del signo */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-rose-800 truncate">
                      {signo.palabra}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {signo.definicion}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {signo.categoria}
                      </span>
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {signo.letra}
                      </span>
                    </div>
                  </div>

                  {/* Imágenes (máximo 3) */}
                  {signo.urls?.length > 0 && (
                    <div className="flex gap-2 mx-4">
                      {signo.urls.slice(0, 3).map((url, index) => (
                        <div
                          key={index}
                          className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200"
                        >
                          <Image
                            src={url}
                            alt={`Imagen ${index + 1} de ${signo.palabra}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/signo/editar/${signo.id}`} passHref>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">
                        Editar
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        setCurrentSigno(signo);
                        setShowDeleteModal(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Confirmar eliminación</h2>
            </div>
            <p className="mb-6">
              ¿Estás seguro de eliminar el signo "{currentSigno?.palabra}"? Esta
              acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
