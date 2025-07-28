
import { useEffect, useState } from "react"
import { useUser } from "@/components/UserContext"
import { TrashIcon, UserIcon, EnvelopeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"

export async function allUsers() {
  const res = await fetch("http://localhost:8080/admin/obtenerusuarios", {
    method: "GET",
    credentials: "include",
  })
  if (!res.ok) throw new Error("Error al obtener los usuarios")
  return await res.json()
}

async function deleteUser(id) {
  const res = await fetch(`http://localhost:8080/admin/delete/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) throw new Error("Error al eliminar el usuario")
  return true
}

function RolBadge({ rol }) {
  const role = rol?.toLowerCase()
  const baseClass = "px-3 py-1.5 rounded-full text-xs font-bold select-none transition-all duration-300 shadow-sm"
  const colorClass =
    role === "admin"
      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-500/25"
      : role === "user"
        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/25"
        : role === "guest"
          ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-gray-500/25"
          : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 shadow-gray-400/25"

  return <span className={`${baseClass} ${colorClass} hover:scale-105 hover:shadow-lg`}>{rol}</span>
}

function LoadingSkeleton() {
  return (
    <div className="w-full max-w-4xl space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="flex flex-col space-y-3 flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <div className="w-16 h-4 bg-gray-300 rounded"></div>
                <div className="w-24 h-4 bg-gray-300 rounded"></div>
                <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="w-48 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="w-24 h-10 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ListaUsuarios() {
  const { user, loading: userLoading } = useUser()
  const [usuarios, setUsuarios] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (user?.rol?.toLowerCase() === "admin") {
      allUsers()
        .then((data) => {
          setUsuarios(data)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
          setTimeout(() => setError(null), 3000)
        })
    }
  }, [user, userLoading])

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return

    try {
      setDeletingId(id)
      await deleteUser(id)
      setUsuarios((prev) => prev.filter((u) => u.id !== id))
      setError(null)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(null), 3000)
    } finally {
      setDeletingId(null)
    }
  }

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col items-center">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Lista de Usuarios
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
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h3>
          <p className="text-gray-600">Solo el administrador puede ver esta página.</p>
        </div>
      </div>
    )
  }

  const usuariosFiltrados = usuarios.filter((u) => {
    const texto = search.toLowerCase()
    return u.username.toLowerCase().includes(texto) || u.email.toLowerCase().includes(texto)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
          Lista de Usuarios
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full mx-auto"></div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-4xl mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por usuario o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 shadow-lg hover:shadow-xl text-gray-800 placeholder-gray-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent rounded-2xl blur-xl -z-10"></div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-2xl mb-6 max-w-4xl w-full text-center shadow-lg backdrop-blur-sm border border-red-400/50">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Users List */}
      <div className="w-full max-w-4xl space-y-4">
        {usuariosFiltrados.length === 0 && !loading && (
          <div className="text-center py-12">
            <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No se encontraron usuarios.</p>
          </div>
        )}

        {usuariosFiltrados.map((usuario, index) => (
          <div
            key={usuario.id}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl hover:border-red-500/30 transition-all duration-300 hover:scale-[1.02] group"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "fadeInUp 0.6s ease-out forwards",
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col space-y-3 flex-1 min-w-0">
                <div className="flex items-center space-x-3 flex-wrap">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-mono text-sm text-red-600 font-bold bg-red-50 px-2 py-1 rounded-lg">
                      #{usuario.id}
                    </span>
                  </div>
                  <span className="font-bold text-lg text-gray-800 truncate">{usuario.username}</span>
                  <RolBadge rol={usuario.rol || "N/A"} />
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <EnvelopeIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm truncate">{usuario.email}</span>
                </div>
              </div>

              <button
                aria-label={`Eliminar usuario ${usuario.username}`}
                disabled={deletingId === usuario.id}
                className={`relative px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 overflow-hidden group/btn hover:shadow-red-500/25 hover:scale-105 active:scale-95 ${
                  deletingId === usuario.id ? "opacity-50 cursor-not-allowed" : "hover:from-red-700 hover:to-red-800"
                }`}
                onClick={() => handleDelete(usuario.id)}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {deletingId === usuario.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <TrashIcon className="h-5 w-5" />
                      Eliminar
                    </>
                  )}
                </span>
                {!deletingId && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative elements */}
      <div className="fixed top-20 right-10 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-gray-400/10 to-transparent rounded-full blur-2xl -z-10"></div>

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
