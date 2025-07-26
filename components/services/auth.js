export async function registerUser(data){
    const res=await fetch("http://localhost:4000/api/register",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data),
    });
    if(!res.ok) throw new Error("Error al registrar");
    
    return await res.json();
}

    export async function loginUser(data) {
        const res=await fetch("http://localhost:8080/auth/login",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data),
            credentials: "include",
        });
        if(!res.ok) throw new Error("Error al logearse");
        const datares = await res.json();
        console.log(datares.message);
    
    }

export async function profile() {
  const res = await fetch("http://localhost:4000/api/profile", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al obtener el usuario");

  return await res.json();
}

