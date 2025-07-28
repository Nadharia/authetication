import { useEffect, useState } from "react";
import { useUser } from "@/components/UserContext";
import { TrashIcon, UserIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export async function allUsers() {
  const res = await fetch("http://localhost:8080/admin/obtenerusuarios", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al obtener los usuarios");
  return await res.json();
}

async function deleteUser(id) {
  const res = await fetch(`http://localhost:8080/admin/delete/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al eliminar el usuario");
  return true;
}

function RolBadge({ rol }) {
  const role = rol?.toLowerCase();

  const baseClass = "px-3 py-1 rounded-full text-xs font-semibold select-none";
  const colorClass =
    role === "admin"
      ? "bg-red-600 text-white"
      : role === "user"
      ? "bg-blue-600 text-white"
      : role === "guest"
      ? "bg-gray-400 text-white"
      : "bg-gray-300 text-gray-700";

  return <span className={`${baseClass} ${colorClass}`}>{rol}</span>;
}

export default function ListaUsuarios() {
  const { user, loading: userLoading } = useUser();
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user?.rol?.toLowerCase() === "admin") {
      allUsers()
        .then((data) => {
          setUsuarios(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
          setTimeout(() => setError(null), 3000);
        });
    }
  }, [user, userLoading]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      setDeletingId(id);
      await deleteUser(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-700 text-lg">Cargando usuarios...</p>
      </div>
    );
  }

  if (!user || user.rol.toLowerCase() !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 text-xl font-bold px-4 text-center">
        Acceso denegado. Solo el administrador puede ver esta página.
      </div>
    );
  }

  const usuariosFiltrados = usuarios.filter((u) => {
    const texto = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(texto) ||
      u.email.toLowerCase().includes(texto)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8 flex flex-col items-center">
      <h2 className="text-3xl font-extrabold mb-6">Lista de Usuarios</h2>

      <input
        type="text"
        placeholder="Buscar por usuario o email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 w-full max-w-3xl px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition"
      />

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-6 max-w-3xl w-full text-center shadow-md">
          <p>{error}</p>
        </div>
      )}

      <ul className="w-full max-w-3xl space-y-5">
        {usuariosFiltrados.length === 0 && (
          <p className="text-center text-gray-500">No se encontraron usuarios.</p>
        )}

        {usuariosFiltrados.map((usuario) => (
          <li
            key={usuario.id}
            className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center border border-gray-300 hover:border-red-600 transition"
          >
            <div className="flex flex-col space-y-1 max-w-xs">
              <p className="font-semibold text-lg truncate">
                <UserIcon className="inline h-5 w-5 mr-1 text-red-600" />
                <span className="font-mono text-red-600">{usuario.id}</span> - {usuario.username}{" "}
                <RolBadge rol={usuario.rol || "N/A"} />
              </p>
              <p className="flex items-center text-sm text-gray-600 truncate">
                <EnvelopeIcon className="inline h-4 w-4 mr-1" />
                {usuario.email}
              </p>
            </div>

            <button
              aria-label={`Eliminar usuario ${usuario.username}`}
              disabled={deletingId === usuario.id}
              className={`bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition flex items-center gap-2 ${
                deletingId === usuario.id ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => handleDelete(usuario.id)}
            >
              {deletingId === usuario.id ? "Eliminando..." : (
                <>
                  <TrashIcon className="h-5 w-5" />
                  Eliminar
                </>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
