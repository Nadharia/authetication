import Link from 'next/link';
import { useRef, useState } from 'react';

import { useRouter } from 'next/router';



export default function Home() {
const passwordRef=useRef();
const userRef = useRef();
const [error,setError]=useState("");
const [message,setMessage]=useState("");
const router=useRouter();

const handleValidation=async(e)=>{
     e.preventDefault();

      const username=userRef.current.value.trim();
      const password=passwordRef.current.value.trim();
     
            if (!username) {
                setError("El user no puede estar vacío");
                return;
            }
            if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
              setError("Solo se permiten letras, números, puntos, guiones y guiones bajos");
                return;
            }

            if (!password) {
                setError("La contraseña no puede estar vacía");
                return;
            }

            try{
              
              await loginUser({username,password});
                              setMessage("Logeado correctamente");
                              console.log("Redirigiendo a /profile");
                              setTimeout(() => {
                router.push("/profile");
              }, 100);
            }catch(err){
               setError("Error al logearse")
               console.log(err);
            }
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow sm:bg-gray-100 sm:shadow-none w-full max-w-sm">

        <h1 className="text-2xl font-bold mb-4 text-center text-black">Login</h1>
        <form className="flex flex-col gap-4" onSubmit={handleValidation}>
          <p className="text-black font-serif">Ingrese el user:</p>
          <input
            type="text"
            placeholder="Usuario"
            className="border border-gray-950 text-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400" ref={userRef}
          />
          <input
            type="password"
            placeholder="Password"  
            className="border border-gray-950 text-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400" ref={passwordRef}
          />
          <button
            type="submit"
            className="bg-gray-600 text-white py-2 rounded hover:bg-black transition" 
          >
            Iniciar sesión
          </button>
           {error ?(<p className="bg-red-400 text-center shadow w-full max-w-sm p-3 rounded text-white font-semibold">
                    {error}
                    </p>):null}
                    {message ?(<p className="bg-green-500 text-center shadow w-full max-w-sm p-3 rounded text-black font-semibold">
                    {message}
                    </p>):null}
          <p className="text-sm text-black text-center">
            ¿No tenés cuenta?{" "}
            <Link href="/register" className="text-red-600 font-bold hover:underline ">Registrate aquí</Link>
            
          </p>
        </form>
      </div>
    </div>
  );
}
