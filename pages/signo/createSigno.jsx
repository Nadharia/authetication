import  { useState } from "react";


export default function CreateSigno() {
  const [palabra, setPalabra] = useState("");
  const [definicion, setDefinicion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [letra, setLetra] = useState("");
  const [urls, setUrls] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleAddUrl = () => {
    setUrls([...urls, ""]);
  };

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
        body: JSON.stringify({
          palabra,
          definicion,
          categoria,
          letra,
          urls: urls.filter((url) => url.trim() !== ""),
        }),
      });

      if (!response.ok) throw new Error("Error al crear el signo");

      const data = await response.json();
      console.log("Signo creado:", data);
      // Redireccionar o mostrar mensaje de éxito si querés
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)] bg-gray-50 text-gray-900 flex flex-col gap-10 p-6 lg:p-12">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-extrabold mb-6 text-rose-700 text-center">
          Crear Signo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Palabra, Categoría y Letra */}
          <div className="flex flex-row gap-3 flex-wrap">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Palabra
              </label>
              <input
                type="text"
                value={palabra}
                onChange={(e) => setPalabra(e.target.value)}
                placeholder="Ej: Perro, Gato, Casa..."
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
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
                placeholder="Ej: Objetos, Animales..."
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
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
                placeholder="A"
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-center uppercase focus:ring-2 focus:ring-rose-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Definición */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Definición
            </label>
            <textarea
              value={definicion}
              onChange={(e) => setDefinicion(e.target.value)}
              required
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

          {/* URLs dinámicas */}
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
                    className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUrl(index)}
                      className="bg-red-500 text-white px-3 rounded-lg hover:bg-red-600 transition"
                      title="Eliminar"
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

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 shadow-md disabled:opacity-50"
              
            >
              {loading ? "Creando..." : "Crear Signo"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-center font-medium">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
