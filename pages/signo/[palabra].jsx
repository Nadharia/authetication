import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import classNames from "classnames";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Signo() {
  const router = useRouter();
  const { palabra } = router.query;

  const [signo, setSigno] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    if (!palabra) return;

    setLoading(true);
    setError(null);

    fetch(`http://localhost:8080/api/signos?query=${encodeURIComponent(palabra)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar el significado");
        return res.json();
      })
      .then((data) => {
        // Parsear el campo urls si viene como string JSON
        const processed = data.map((s) => ({
          ...s,
          urls: typeof s.urls === "string" ? JSON.parse(s.urls) : s.urls,
        }));

        const exactMatch = processed.find(
          (s) => s.palabra?.toLowerCase() === palabra.toLowerCase()
        );
        if (exactMatch) {
          setSigno(exactMatch);
          setMainImageIndex(0);
        } else if (processed.length > 0) {
          setSigno(processed[0]);
          setMainImageIndex(0);
        } else {
          setError("No se encontró el significado");
        }
      })
      .catch((err) => {
        setError(err.message);
        setSigno(null);
      })
      .finally(() => setLoading(false));
  }, [palabra]);

  // Rotar imagen principal automáticamente si hay más de una imagen
  useEffect(() => {
    if (!signo?.urls || signo.urls.length < 2) return;

    const interval = setInterval(() => {
      setMainImageIndex((prevIndex) => (prevIndex + 1) % signo.urls.length);
    }, 4000); // cada 4 segundos

    return () => clearInterval(interval);
  }, [signo]);

  const mainImage = signo?.urls?.[mainImageIndex] || null;

  const carouselSettings = {
    dots: false,
    infinite: signo?.urls?.length > 4,
    speed: 400,
    slidesToShow: Math.min(signo?.urls?.length || 1, 4),
    slidesToScroll: 1,
    focusOnSelect: true,
    arrows: true,
    beforeChange: (_, next) => setMainImageIndex(next),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
    ],
  };

  const fechaFormateada = signo?.fechaAlta
    ? new Date(signo.fechaAlta).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "No disponible";

  return (
    <div className="min-h-[calc(100vh-96px)] bg-gray-50 text-gray-900 flex flex-col gap-10 p-6 lg:p-12">
      {/* Palabra y imagen */}
      <div className="relative bg-rose-700 rounded-xl shadow-xl p-4 lg:p-6 flex flex-col items-center justify-center text-white">
        {/* Palabra flotante */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-rose-900 bg-opacity-90 px-6 py-3 rounded-xl shadow-md font-mono text-2xl sm:text-4xl font-bold z-[1] max-w-[90%] text-center whitespace-nowrap overflow-hidden text-ellipsis">
          {palabra?.toUpperCase() || "..."}
        </div>

        {/* Imagen principal */}
        {mainImage ? (
          <img
            src={mainImage}
            alt="Imagen principal"
            className="mt-20 w-full max-w-5xl h-72 sm:h-96 object-contain rounded-lg bg-white transition-all duration-500"
          />
        ) : (
          <p className="mt-24 text-white text-lg font-semibold">No hay imágenes disponibles</p>
        )}

        {/* Carrusel miniaturas */}
        {signo?.urls && signo.urls.length > 1 && (
          <div className="w-full max-w-5xl mt-6">
            <Slider {...carouselSettings}>
              {signo.urls.map((url, index) => (
                <div key={index} className="p-2">
                  <img
                    src={url}
                    alt={`Miniatura ${index + 1}`}
                    className={classNames(
                      "rounded-lg border-4 transition duration-300 cursor-pointer",
                      index === mainImageIndex ? "border-amber-400" : "border-transparent",
                      "object-contain h-20 w-full"
                    )}
                    loading="lazy"
                    onClick={() => setMainImageIndex(index)}
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>

      {/* Significado */}
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 max-w-3xl mx-auto text-left">
        <h2 className="text-3xl font-extrabold mb-6 text-rose-700">Significado</h2>

        {loading && <p className="text-gray-500 text-lg">Cargando...</p>}
        {error && <p className="text-red-600 text-lg">{error}</p>}

        {!loading && signo && (
          <div className="space-y-4 text-base sm:text-lg">
            <p><strong>Definición:</strong> {signo.definicion}</p>
            <p><strong>Categoría:</strong> {signo.categoria}</p>
            <p><strong>Letra:</strong> {signo.letra}</p>
            <p><strong>Fecha de alta:</strong> {fechaFormateada}</p>
          </div>
        )}
      </div>
    </div>
  );
}
