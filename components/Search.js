export default function Search({ className = "" }) {
  return (
    <div className={`flex left-0 w-64 h-8  relative   md:w-[400px] ${className}`}>
      <input
        type="text"
        placeholder="Buscar..."
        className="w-full h-full bg-black text-white pl-4 pr-20 rounded-2xl placeholder:text-white outline-none focus:outline-none focus:bg-white focus:text-black focus:border-2 hover:bg-white hover:placeholder:text-black transition duration-500"
      />
      <button
        type="submit"
        className="absolute right-1 top-1 bottom-1 bg-white text-black px-4 rounded-2xl hover:bg-black hover:text-white  transition duration-500"
      >
        Buscar
      </button>
    </div>
  );
}
