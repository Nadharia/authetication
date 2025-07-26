import { useEffect, useState } from "react";

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

// Componente principal
export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    allUsers()
      .then((data) => {
        setUsuarios(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      setDeletingId(id);
      await deleteUser(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      setError(null); // limpiar error si hubo uno previo
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <p className="text-white text-center mt-10 text-lg">Cargando usuarios...</p>
    );

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">Lista de Usuarios</h2>

      {error && (
        <div className="bg-red-700 text-white p-3 rounded mb-4 max-w-2xl w-full text-center">
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 underline hover:text-gray-300"
          >
            Cerrar
          </button>
        </div>
      )}

      <ul className="w-full max-w-2xl space-y-4">
        {usuarios.map((usuario) => (
          <li
            key={usuario.id}
            className="bg-white text-black p-4 rounded-lg shadow flex justify-between items-center hover:bg-gray-600 hover:text-white transition duration-300"
          >
            <div>
              <p className="font-semibold">
                ID: <span className="font-mono">{usuario.id}</span> - {usuario.username}
              </p>
              <p className="text-sm text-black">{usuario.email}</p>
            </div>
            <button
              aria-label={`Eliminar usuario ${usuario.username}`}
              disabled={deletingId === usuario.id}
              className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition ${
                deletingId === usuario.id ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => handleDelete(usuario.id)}
            >
              {deletingId === usuario.id ? "Eliminando..." : "Eliminar"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
