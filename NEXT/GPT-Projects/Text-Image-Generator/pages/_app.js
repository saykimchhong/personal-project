import "@/styles/globals.css";
import Layout from "@/components/Layout";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  });
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
