import "@/styles/globals.css";
import Layout from "@/components/Layout";
const routesWithLayout = [
  "/profile",
  "/dashboard",
  "/signo",
  "/_usuarios",
  "/diccionario",
  "/signo/crearSigno",
  "/signo/[palabra]/editarSigno",
];

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

  return PageContent;
}
