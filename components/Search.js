import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";

export default function Search() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        buscar(query);
      } else {
        setResultados([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const buscar = async (texto) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/signos?query=${encodeURIComponent(texto)}`
      );
      const data = await res.json();
      setResultados(data);
    } catch (err) {
      console.error("Error al buscar:", err);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const irASigno = (palabra) => {
    router.push(`/signo/${encodeURIComponent(palabra)}`);
    setQuery("");
    setResultados([]);
  };

  const inputClass = classNames(
    "w-full h-8 bg-black text-white pl-4 pr-20 rounded-2xl placeholder:text-white outline-none",
    "focus:outline-none focus:bg-white focus:text-black focus:border-2 hover:bg-white hover:placeholder:text-black transition duration-500"
  );

  const buttonClass = classNames(
    "absolute right-1 top-1 bottom-1 bg-white text-black px-4 rounded-2xl",
    "hover:bg-black hover:text-white transition duration-500"
  );

  const containerClass = classNames("w-full flex flex-col md:flex-row gap-4 items-start");

  const resultadosContainerClass = classNames(
    "absolute mt-1 w-full md:w-80 max-h-64 overflow-y-auto bg-white text-black rounded-xl shadow p-4 space-y-2 z-10"
  );

  return (
    <div className={containerClass}>
      <div className="relative w-full md:w-[400px] h-8">
        <input
          type="text"
          placeholder="Buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={inputClass}
        />
        <button type="button" onClick={() => buscar(query)} className={buttonClass}>
          Buscar
        </button>

        {query && resultados.length > 0 && (
          <div className={resultadosContainerClass}>
            {loading && <p className="text-gray-500">Cargando...</p>}
            {!loading &&
              resultados.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => irASigno(item.palabra)}
                  className="cursor-pointer border-b py-2 hover:bg-gray-100 transition rounded px-2"
                >
                  <p className="font-bold">{item.palabra}</p>
                  <p className="text-sm text-gray-600">{item.categoria}</p>
                </div>
              ))}
          </div>
        )}

        {query && !loading && resultados.length === 0 && (
          <div className="absolute mt-1 w-full bg-white text-black rounded shadow p-2 z-10">
            <p className="text-sm text-gray-600">Sin resultados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
