import Image from "next/image";


const cookie = require('cookie');

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;

  /*
  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  */

  try {
    const res = await fetch("http://localhost:4000/api/profile", {
      headers: {
        Cookie: `token=${token}`, 
      },
    });

    if (!res.ok) {
      throw new Error("Token inválido");
    }

    const data = await res.json();

    return {
      props: {
        user: data.user,
        message: "Inicio exitoso",
      },
    };
  } catch (error) {
    console.error("Error al validar token:", error.message);

    return {
      props: {
        user: null,
        message: "Token inválido o no presente",
      },
      
      /*
      redirect: {
        destination: "/profile",
        permanent: false,
      },
      */
    };
  }
}

export default function Dashboard({ user }) {
  return (
    <div className="bg-black rounded m-6 h-screen flex items-center justify-start ">
      
      <h1 className="text-left text-white text-9xl font-bold px-6 mt-[-100px] m-4">
        Bienvenido<br />{user?.email || "Invitado"}
      </h1>
        <Image
          src="/lenguaje-de-senas.png"
          alt="icono"
          width={600}
          height={600}
          className="invert brightness-200 absolute right-[10%] top-1/3"
        />


    </div>
  );
}
