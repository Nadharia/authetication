import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/components/UserContext";

export default function CreateSigno() {
  const [palabra, setPalabra] = useState("");
  const [definicion, setDefinicion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [letra, setLetra] = useState("");
  const [urls, setUrls] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      router.replace("/404");
    }
  }, [user, router]);

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
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/api/signos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto w-full">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-rose-700">Crear Signo</h1>
          {error && (
            <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md animate-fadeIn">
              <div className="flex items-center gap-2">
                <svg
                  className="w-6 h-6 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="font-semibold">{error}</p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Inputs principales */}
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[180px]">
              <label
                htmlFor="palabra"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Palabra
              </label>
              <input
                id="palabra"
                type="text"
                value={palabra}
                onChange={(e) => setPalabra(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                placeholder="Ej: Amistad"
              />
            </div>

            <div className="flex-1 min-w-[180px]">
              <label
                htmlFor="categoria"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Categoría
              </label>
              <input
                id="categoria"
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                placeholder="Ej: Emoción"
              />
            </div>

            <div className="w-[90px]">
              <label
                htmlFor="letra"
                className="block text-sm font-semibold text-gray-700 mb-2 text-center"
              >
                Letra
              </label>
              <input
                id="letra"
                type="text"
                maxLength={1}
                value={letra}
                onChange={(e) => setLetra(e.target.value.toUpperCase())}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-gray-900 uppercase placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                placeholder="A"
              />
            </div>
          </div>

          {/* Definición */}
          <div>
            <label
              htmlFor="definicion"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Definición
            </label>
            <textarea
              id="definicion"
              value={definicion}
              onChange={(e) => setDefinicion(e.target.value)}
              required
              rows={5}
              placeholder="Escribe la definición aquí..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
            />
          </div>

          {/* URLs */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              URLs de imágenes
            </label>
            <div className="flex flex-col gap-3">
              {urls.map((url, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    type="url"
                    value={url}
                    placeholder={`URL ${i + 1}`}
                    onChange={(e) => handleUrlChange(i, e.target.value)}
                    className="flex-grow rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                  />
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUrl(i)}
                      aria-label="Eliminar URL"
                      className="inline-flex items-center justify-center rounded-lg bg-red-600 p-3 text-white hover:bg-red-700 transition"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddUrl}
                className="self-start text-rose-700 font-semibold hover:underline mt-1"
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
              className="rounded-lg bg-rose-600 px-10 py-3 text-white font-bold shadow-lg hover:bg-rose-700 disabled:opacity-50 transition"
            >
              {loading ? "Creando..." : "Crear Signo"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de éxito */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-2xl text-center animate-scaleIn transition-transform duration-300">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-extrabold text-gray-800">
              ¡Signo creado con éxito!
            </h2>
            <p className="mb-6 text-gray-600">El signo "{palabra}" ha sido guardado correctamente.</p>
            <button
              onClick={handleCerrarModal}
              className="w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 py-3 font-semibold text-white shadow-lg hover:from-green-600 hover:to-green-700 transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
