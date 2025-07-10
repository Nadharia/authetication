import classNames from "classnames";

export default function Signo() {
  const containerClass = classNames(
    "w-full min-h-screen flex flex-col bg-black lg:flex-row"
  );

  const leftSectionClass = classNames(
    "bg-red-500 flex-[2] relative",
    "rounded-bl-lg",
    "lg:rounded-bl-none lg:rounded-r-lg"
  );

  const floatingBoxClass = classNames(
    "flex bg-amber-950 h-16 w-2/3 absolute bottom-40 inset-x-0 mx-auto",
    "rounded-xl justify-center items-center",
    "lg:h-24"
  );

  const rightSectionClass = classNames(
    "bg-black flex-[1] flex flex-col items-center justify-center text-center text-white px-4"
  );

  const textClass = classNames(
    "font-mono text-xl text-white sm:text-4xl"
  );

  return (
    <div className={containerClass}>
      <div className={leftSectionClass}>
        <div className={floatingBoxClass}>
          <p className={textClass}>HOLA</p>
        </div>
      </div>

      <div className={rightSectionClass}>
        <h1 className="text-2xl mb-2">Significado</h1>
        <p className="text-sm">
          Esto es una palabra que significa que lindo es el tiempo.
        </p>
      </div>
    </div>
  );
}
