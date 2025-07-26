import Image from "next/image";





export default function Dashboard({ user }) {
  return (
    <div className="bg-black rounded m-6 min-h-screen flex flex-col lg:flex-row items-center justify-center relative overflow-hidden px-4 py-8 lg:px-16 lg:py-12 gap-8 lg:gap-0">
      
      {/* Contenedor del texto con fondo en lg */}
      <div className="text-white text-center lg:text-left z-10 max-w-screen-md  lg:p-6 lg:rounded-xl ">
        <h1 className="text-5xl sm:text-5xl lg:text-7xl 2xl:text-7xl font-bold leading-tight mb-4 drop-shadow-md">
          Bienvenido<br />{user?.email || "Invitado"}
        </h1>
        <p className="text-gray-300 text-base sm:text-lg drop-shadow-sm lg:bg-black/60 lg:backdrop-blur-sm">
          Nos alegra tenerte aquí. Accedé a tus funciones personalizadas.
        </p>
      </div>

      {/* Imagen a la derecha */}
      <div className="relative mt-6 lg:mt-0 lg:absolute lg:right-[5%] lg:top-1/2 lg:-translate-y-1/2">
        <Image
          src="/lenguaje-de-senas.png"
          alt="icono"
          width={0}
          height={0}
          sizes="(max-width: 768px) 160px, (max-width: 1200px) 300px, 500px"
          className="invert brightness-150 opacity-90 mx-auto lg:mx-0
            w-40 sm:w-60 md:w-72 lg:w-[300px] xl:w-[400px] 2xl:w-[500px]
            h-auto"
        />
      </div>
    </div>
  );
}
