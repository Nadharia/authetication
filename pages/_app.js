import "@/styles/globals.css";
import Layout from "@/components/Layout";

// Lista de rutas que **usan** layout
const routesWithLayout = ["/profile","/signo"];

export default function MyApp({ Component, pageProps, router }) {
  const useLayout = routesWithLayout.includes(router.pathname);

  const PageContent = useLayout ? (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  ) : (
    <Component {...pageProps} />
  );

  return PageContent;
}
