import { UserProvider } from "@/components/UserContext";
const routesWithLayout = ["/dashboard", "/signo","/_usuarios","/register","/logs","/diccionario",
  "/signo/crear",
  "/signo/editar/[id]",];


export default function MyApp({ Component, pageProps, router }) {
  const useLayout = routesWithLayout.some((path) =>
    router.pathname.startsWith(path)
  );

  const PageContent = useLayout ? (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  ) : (
    <Component {...pageProps} />
  );

    return <UserProvider>{PageContent}</UserProvider>;
}
