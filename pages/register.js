import  React,{ useRef, useState } from "react"
import { registerUser } from "@/components/services/auth";
import Link from 'next/link';
export default function Register() {
    
    const passwordRef=useRef();
    const passwordConfirm=useRef();
    const useRefEmail=useRef();
    const [error,setError]=useState("");
    const [message,setMessage]=useState("");
    const handleValidation  = async(e) => {
            e.preventDefault();
            
            const email = useRefEmail.current.value.trim();
            const password = passwordRef.current.value.trim();
            const confirm = passwordConfirm.current.value.trim();

            if (!email) {
                setError("El email no puede estar vacío");
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError("El email no es válido");
                return;
            }
            if (!password) {
                setError("La contraseña no puede estar vacía");
                return;
            }
            if (password !== confirm) {
                setError("Las contraseñas tienen que ser iguales");
                return;
            }

            setError(""); 

            try{
                await registerUser({email,password});
                setMessage("Registrado correctamente");
            }
            catch(err){
                setError(err.message);
            }

            
            };

       return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white items-center justify-center shadow w-full max-w-sm p-6">
                <h1 className="text-2xl font-bold mb-4 text-center text-black p-2 m-2">Register</h1>
                
                <form className="  flex flex-col gap-4">
                    <p className="text-black font-serif">Ingrese el email:</p>
                    <input
                        type="email"
                        placeholder="Email"
                        className="border border-gray-950 text-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400" ref={useRefEmail}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border border-gray-950 text-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400" ref={passwordRef}
                    />

                    <input
                        type="password"
                        placeholder="Confirm password"
                        className="border border-gray-950 text-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400" ref={passwordConfirm}
                    />
                    
                    <button
                        type="submit"
                        className="bg-gray-600 text-white py-2 rounded hover:bg-black transition" onClick={handleValidation}
                    >
                        Registrar
                    </button>
                    {error ?(<p className="bg-red-400 text-center shadow w-full max-w-sm p-3 rounded text-white font-semibold">
                    {error}
                    </p>):null}
                    {message ?(<p className="bg-green-500 text-center shadow w-full max-w-sm p-3 rounded text-black font-semibold">
                    {message}
                    </p>):null}
                </form>
                    <p className="text-sm text-black text-center p-6">
                        ¿Ya tenés cuenta?{" "}
                        <Link href="/" className="text-red-600 font-bold hover:underline">
                            Iniciá sesión aquí
                        </Link>
                        </p>



            </div>


        </div>
    )
}