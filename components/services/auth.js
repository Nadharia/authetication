export async function registerUser(data) {
  const res = await fetch("http://localhost:8080/admin/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) {
    
    let errorMsg = "Error al registrar";
    try {
      const errorData = await res.json();
      if (errorData?.message) errorMsg = errorData.message;
    } catch {
      
    }
    throw new Error(errorMsg);
  }

  return await res.json();
}


   export async function loginUser(data) {
  const res = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) {
    // Intenta obtener el mensaje de error del cuerpo JSON
    const errorData = await res.json().catch(() => null);
    const errorMessage = errorData?.message || "Error al logearse";
    throw new Error(errorMessage);
  }

  const datares = await res.json();
  console.log(datares.message);

  return datares;
}


export async function profile() {
  const res = await fetch("http://localhost:8080/auth/profile", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al obtener el usuario");

  return await res.json();
}

