import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";

export default function Search() {
  const [query, setQuery] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  // Búsqueda con debounce (limitada a 4 resultados)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        buscarSugerencias(query);
      } else {
        setSugerencias([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const buscarSugerencias = async (texto) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/signos?query=${encodeURIComponent(
          texto
        )}&limit=4`
      );
      const data = await res.json();
      setSugerencias(data.slice(0, 4)); // Aseguramos máximo 4 resultados
      setShowDropdown(true);
    } catch (err) {
      console.error("Error al buscar:", err);
      setSugerencias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      // Búsqueda con texto: redirige a diccionario con el query
      router.push({
        pathname: "/diccionario",
        query: { search: query },
      });
    } else {
      // Búsqueda vacía: redirige a diccionario sin filtros
      router.push("/diccionario");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const irASigno = (palabra) => {
    router.push(`/signo/${encodeURIComponent(palabra)}`);
    setQuery("");
    setSugerencias([]);
    setShowDropdown(false);
  };

  const handleFocus = () => {
    if (query.trim() && sugerencias.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const inputClass = classNames(
    "w-full h-8 bg-black text-white pl-4 pr-20 rounded-2xl placeholder:text-white outline-none",
    "focus:outline-none focus:bg-white focus:text-black focus:border-2 hover:bg-white hover:placeholder:text-black transition duration-500"
  );

  const buttonClass = classNames(
    "absolute right-1 top-1 bottom-1 bg-white text-black px-4 rounded-2xl",
    "hover:bg-black hover:text-white transition duration-500"
  );

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 items-start">
      <div className="relative w-full md:w-[400px] h-8">
        <input
          type="text"
          placeholder="Buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={inputClass}
        />
        <button
          type="button"
          onClick={handleSearchSubmit}
          className={buttonClass}
        >
          Buscar
        </button>

        {/* Dropdown de sugerencias (máximo 4) */}
        {showDropdown && (sugerencias.length > 0 || loading) && (
          <div className="absolute mt-1 w-full md:w-80 max-h-64 overflow-y-auto bg-white text-black rounded-xl shadow p-4 space-y-2 z-10">
            {loading ? (
              <p className="text-gray-500">Cargando...</p>
            ) : (
              sugerencias.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => irASigno(item.palabra)}
                  className="cursor-pointer border-b py-2 hover:bg-gray-100 transition rounded px-2"
                >
                  <p className="font-bold">{item.palabra}</p>
                  <p className="text-sm text-gray-600">{item.categoria}</p>
                </div>
              ))
            )}
          </div>
        )}

        {showDropdown && !loading && sugerencias.length === 0 && query && (
          <div className="absolute mt-1 w-full bg-white text-black rounded shadow p-2 z-10">
            <p className="text-sm text-gray-600">Sin resultados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
