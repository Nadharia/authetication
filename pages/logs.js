import { useEffect, useState } from "react";
import { useUser } from "@/components/UserContext";
import { ImSpinner8 } from "react-icons/im";

export async function allLogs() {
  const res = await fetch("http://localhost:8080/admin/logs", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al obtener los logs");
  return await res.json();
}

export default function ListaLogs() {
  const { user, loading: userLoading } = useUser();
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    if (user?.rol?.toLowerCase() === "admin") {
      allLogs()
        .then((data) => {
          
          const logsOrdenados = data.sort(
            (a, b) => new Date(b.fecha) - new Date(a.fecha)
          );
          setLogs(logsOrdenados);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
          setTimeout(() => setError(null), 3000);
        });
    }
  }, [user, userLoading]);

  function exportToCSV(logsToExport) {
    const headers = ["ID", "Usuario", "Descripción", "Fecha"];
    const rows = logsToExport.map((log) => [
      log.id,
      log.usuario?.username || "Desconocido",
      log.descripcion,
      new Date(log.fecha).toLocaleString(),
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "logs_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (userLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ImSpinner8 className="animate-spin text-red-600 text-4xl mb-4" />
        <p className="text-gray-700 text-lg">Cargando logs...</p>
      </div>
    );
  }

  if (!user || user.rol.toLowerCase() !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 text-xl font-bold">
        Acceso denegado. Solo el administrador puede ver esta página.
      </div>
    );
  }

  // Filtro por búsqueda (usuario o descripción)
  const logsFiltrados = logs.filter((log) => {
    const texto = search.toLowerCase();
    return (
      (log.descripcion?.toLowerCase().includes(texto) ||
        log.usuario?.username?.toLowerCase().includes(texto))
    );
  });

  // Paginación simple
  const totalPages = Math.ceil(logsFiltrados.length / logsPerPage);
  const startIndex = (page - 1) * logsPerPage;
  const paginatedLogs = logsFiltrados.slice(startIndex, startIndex + logsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8 flex flex-col items-center">
      <h2 className="text-3xl font-extrabold mb-6">Lista de Logs</h2>

      <input
        type="text"
        placeholder="Buscar por usuario o descripción..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-3xl px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition"
      />

      <button
        onClick={() => exportToCSV(logsFiltrados)}
        className="mb-8 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Exportar logs a CSV
      </button>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-6 max-w-3xl w-full text-center shadow-md">
          <p>{error}</p>
        </div>
      )}

      <ul className="w-full max-w-3xl space-y-5">
        {paginatedLogs.length === 0 && (
          <p className="text-center text-gray-500">No se encontraron logs.</p>
        )}
        {paginatedLogs.map((log) => (
          <li
            key={log.id}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-300 hover:border-red-600 transition"
          >
            <div>
              <p className="font-semibold text-lg mb-1">
                Usuario:{" "}
                <span className="font-mono text-red-600">
                  {log.usuario?.username || "Desconocido"}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-2">{log.descripcion}</p>
              <p className="text-xs text-gray-500">
                Fecha: {new Date(log.fecha).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="flex items-center px-2">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
