import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Rutas donde NO querés aplicar el layout
  const noLayoutRoutes = ["/", "/register"];

  // Si la ruta actual está en esa lista, no usar Layout
  const isExcluded = noLayoutRoutes.includes(router.pathname);

  return isExcluded ? (
    <Component {...pageProps} />
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
