const cookie = require('cookie');


export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const res = await fetch("http://localhost:4000/api/profile", {
      headers: {
        Cookie: `token=${token}`, // Pasamos el token al backend
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
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}


export default function Dashboard({ user }) {
  return (
    <div>
      <h1>Bienvenido, {user.email}</h1>
    </div>
  );
}