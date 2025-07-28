import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function EditarSigno() {
  const [formData, setFormData] = useState({
    palabra: "",
    definicion: "",
    categoria: "",
    letra: "",
    urls: [""],
  });
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  // Cargar datos del signo al montar el componente
  useEffect(() => {
    if (id) {
      const cargarSigno = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/signos/${id}`
          );
          if (!response.ok) {
            throw new Error("Error al cargar el signo");
          }
          const data = await response.json();
          setFormData({
            palabra: data.palabra,
            definicion: data.definicion,
            categoria: data.categoria,
            letra: data.letra,
            urls: data.urls || [""],
          });
        } catch (err) {
          setError(err.message);
        }
      };
      cargarSigno();
    }
  }, [id]);

  const handleUrlChange = (index, value) => {
    const newUrls = [...formData.urls];
    newUrls[index] = value;
    setFormData({ ...formData, urls: newUrls });
  };

  const handleAddUrl = () =>
    setFormData({ ...formData, urls: [...formData.urls, ""] });

  const handleRemoveUrl = (index) => {
    const newUrls = [...formData.urls];
    newUrls.splice(index, 1);
    setFormData({ ...formData, urls: newUrls });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "letra" ? value.toUpperCase() : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/signos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          urls: formData.urls.filter((url) => url.trim() !== ""),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el signo");
      }

      setMostrarModal(true);
    } catch (err) {
      setError(err.message || "Hubo un error al actualizar el signo");
    } finally {
      setLoading(false);
    }
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    router.push(`/signo/${encodeURIComponent(formData.palabra)}`);
  };

  return (
    <div className="min-h-[calc(100vh-96px)] bg-gray-50 text-gray-900 flex flex-col gap-10 p-6 lg:p-12">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 max-w-3xl mx-auto w-full">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-extrabold text-rose-700 text-center">
            Editar Signo
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
                name="palabra"
                value={formData.palabra}
                onChange={handleChange}
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
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
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
                name="letra"
                maxLength={1}
                value={formData.letra}
                onChange={handleChange}
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
              name="definicion"
              value={formData.definicion}
              onChange={handleChange}
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
              {formData.urls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={url}
                    placeholder={`URL ${index + 1}`}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400"
                  />
                  {formData.urls.length > 1 && (
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
              {loading ? "Actualizando..." : "Actualizar Signo"}
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
              ¡Signo actualizado!
            </h2>
            <p className="text-gray-600">
              El signo "{formData.palabra}" ha sido actualizado correctamente.
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
