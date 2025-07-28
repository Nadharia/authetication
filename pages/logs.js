

import { useEffect, useState } from "react"
import { useUser } from "@/components/UserContext"
import {
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  UserIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline"

export async function allLogs() {
  const res = await fetch("http://localhost:8080/admin/logs", {
    method: "GET",
    credentials: "include",
  })
  if (!res.ok) throw new Error("Error al obtener los logs")
  return await res.json()
}

function LoadingSkeleton() {
  return (
    <div className="w-full max-w-5xl space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 animate-pulse">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="w-32 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="w-full h-4 bg-gray-300 rounded"></div>
            <div className="w-48 h-3 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ListaLogs() {
  const { user, loading: userLoading } = useUser()
  const [logs, setLogs] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [exporting, setExporting] = useState(false)
  const logsPerPage = 10

  useEffect(() => {
    if (user?.rol?.toLowerCase() === "admin") {
      allLogs()
        .then((data) => {
          const logsOrdenados = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          setLogs(logsOrdenados)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
          setTimeout(() => setError(null), 3000)
        })
    }
  }, [user, userLoading])

  async function exportToCSV(logsToExport) {
    setExporting(true)

    // Simular un pequeño delay para mostrar el estado de carga
    await new Promise((resolve) => setTimeout(resolve, 500))

    const headers = ["ID", "Usuario", "Descripción", "Fecha"]
    const rows = logsToExport.map((log) => [
      log.id,
      log.usuario?.username || "Desconocido",
      log.descripcion,
      new Date(log.fecha).toLocaleString(),
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map((e) => e.join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "logs_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setExporting(false)
  }

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col items-center">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Lista de Logs
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full mx-auto"></div>
        </div>
        <LoadingSkeleton />
      </div>
    )
  }

  if (!user || user.rol.toLowerCase() !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-200/50 text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h3>
          <p className="text-gray-600">Solo el administrador puede ver esta página.</p>
        </div>
      </div>
    )
  }

  // Filtro por búsqueda (usuario o descripción)
  const logsFiltrados = logs.filter((log) => {
    const texto = search.toLowerCase()
    return log.descripcion?.toLowerCase().includes(texto) || log.usuario?.username?.toLowerCase().includes(texto)
  })

  // Paginación simple
  const totalPages = Math.ceil(logsFiltrados.length / logsPerPage)
  const startIndex = (page - 1) * logsPerPage
  const paginatedLogs = logsFiltrados.slice(startIndex, startIndex + logsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
          Lista de Logs
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full mx-auto"></div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-5xl mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por usuario o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 shadow-lg hover:shadow-xl text-gray-800 placeholder-gray-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent rounded-2xl blur-xl -z-10"></div>
        </div>

        {/* Export Button */}
        <div className="flex justify-center">
          <button
            onClick={() => exportToCSV(logsFiltrados)}
            disabled={exporting}
            className="relative px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center gap-3 overflow-hidden group hover:shadow-green-500/25 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-3">
              {exporting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Exportando...
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  Exportar logs a CSV
                </>
              )}
            </span>
            {!exporting && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-2xl mb-6 max-w-5xl w-full text-center shadow-lg backdrop-blur-sm border border-red-400/50">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="w-full max-w-5xl mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-lg">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Total de logs: <span className="font-bold text-gray-800">{logs.length}</span>
            </span>
            <span>
              Filtrados: <span className="font-bold text-gray-800">{logsFiltrados.length}</span>
            </span>
            <span>
              Página {page} de {totalPages}
            </span>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="w-full max-w-5xl space-y-4">
        {paginatedLogs.length === 0 && !loading && (
          <div className="text-center py-12">
            <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No se encontraron logs.</p>
          </div>
        )}

        {paginatedLogs.map((log, index) => (
          <div
            key={log.id}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl hover:border-red-500/30 transition-all duration-300 hover:scale-[1.01] group"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "fadeInUp 0.6s ease-out forwards",
            }}
          >
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-sm text-gray-500">Usuario:</span>
                  <span className="ml-2 font-mono font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                    {log.usuario?.username || "Desconocido"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/50">
                <p className="text-gray-800 leading-relaxed">{log.descripcion}</p>
              </div>

              {/* Date */}
              <div className="flex items-center space-x-2 text-gray-500">
                <ClockIcon className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(log.fecha).toLocaleString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Anterior
          </button>

          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1
              const isActive = pageNum === page
              const isNear = Math.abs(pageNum - page) <= 2

              if (!isNear && pageNum !== 1 && pageNum !== totalPages) {
                return pageNum === 2 || pageNum === totalPages - 1 ? (
                  <span key={pageNum} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : null
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-110"
                      : "bg-white/80 text-gray-600 hover:bg-gray-100 hover:scale-105"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
          >
            Siguiente
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Decorative elements */}
      <div className="fixed top-20 right-10 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl -z-10"></div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
