import { useRouter } from "next/router";
import classNames from "classnames";

export default function Login({ isActive = true, isLoggedIn }) {
  const router = useRouter();

  const loginClass = classNames(
    "h-8 px-4 rounded text-xs",
    {
      "bg-red-500 text-white hover:bg-black transition duration-500": isActive,
      "bg-gray-400 text-black cursor-not-allowed": !isActive,
    }
  );

  const handleClick = () => {
    if (!isLoggedIn && isActive) {
      router.push("/");
    }
    // Si querés, podés agregar else para logout o nada.
  };

  return (
    <button
      onClick={handleClick}
      className={loginClass}
      disabled={!isActive}
      title={isLoggedIn ? "Ya estás logueado" : "Ir a login"}
    >
      {isLoggedIn ? "Bienvenido" : "Iniciar Sesión"}
    </button>
  );
}
