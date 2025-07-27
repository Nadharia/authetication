import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateSigno() {
  const [palabra, setPalabra] = useState("");
  const [definicion, setDefinicion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [letra, setLetra] = useState("");
  const [urls, setUrls] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState(null); // Nuevo estado para el error

  const router = useRouter();

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleAddUrl = () => setUrls([...urls, ""]);
  const handleRemoveUrl = (index) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Limpiamos errores previos

    try {
      const response = await fetch("http://localhost:8080/api/signos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          palabra,
          definicion,
          categoria,
          letra,
          urls: urls.filter((url) => url.trim() !== ""),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el signo");
      }

      // Solo mostramos modal en caso de éxito
      setMostrarModal(true);
    } catch (err) {
      setError(err.message || "Hubo un error al crear el signo");
    } finally {
      setLoading(false);
    }
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    router.push(`/signo/${encodeURIComponent(palabra)}`);
  };

  return (
    <div className="min-h-[calc(100vh-96px)] bg-gray-50 text-gray-900 flex flex-col gap-10 p-6 lg:p-12">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 max-w-3xl mx-auto w-full">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-extrabold text-rose-700 text-center">
            Crear Signo
          </h1>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded animate-fadeIn">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inputs: palabra, categoria, letra */}
          <div className="flex flex-row gap-3 flex-wrap">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Palabra
              </label>
              <input
                type="text"
                value={palabra}
                onChange={(e) => setPalabra(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div className="w-[80px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Letra
              </label>
              <input
                type="text"
                maxLength={1}
                value={letra}
                onChange={(e) => setLetra(e.target.value.toUpperCase())}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-center uppercase focus:ring-2 focus:ring-rose-400"
              />
            </div>
          </div>

          {/* Definicion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Definición
            </label>
            <textarea
              value={definicion}
              onChange={(e) => setDefinicion(e.target.value)}
              required
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URLs de imágenes
            </label>
            <div className="space-y-3">
              {urls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={url}
                    placeholder={`URL ${index + 1}`}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400"
                  />
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUrl(index)}
                      className="bg-red-500 text-white px-3 rounded-lg hover:bg-red-600 transition"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddUrl}
                className="text-rose-700 font-medium hover:underline mt-2"
              >
                + Agregar otra URL
              </button>
            </div>
          </div>

          {/* Botón */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear Signo"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal solo para éxito */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200 max-w-md w-full text-center space-y-4 animate-scaleIn transition-all duration-300 transform">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              ¡Signo creado con éxito!
            </h2>
            <p className="text-gray-600">
              El signo "{palabra}" ha sido guardado correctamente.
            </p>

            <button
              onClick={handleCerrarModal}
              className="w-full py-3 px-4 rounded-lg font-medium tracking-wide bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-green-200 transition-colors duration-200"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
