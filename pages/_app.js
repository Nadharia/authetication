
import "@/styles/globals.css";
import Layout from "@/components/Layout";
import { UserProvider } from "@/components/UserContext";
const routesWithLayout = ["/profile", "/dashboard", "/signo","/_usuarios"];

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
