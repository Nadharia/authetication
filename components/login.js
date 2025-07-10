// components/Login.jsx
import classNames from "classnames";

export default function Login({ isActive = true }) {
  const loginClass = classNames(
    
    "h-6 px-4 rounded text-xs",
    {
      "bg-red-500 text-white hover:bg-black trasition duration-500": isActive,
      "bg-gray-400 text-black": !isActive,
    }
  );

  return <button className={loginClass}>Iniciar Sesion</button>;
}
