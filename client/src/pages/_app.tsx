import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import NewsProvider from "./news-provider/news-provider";
import Navbar from "./shared-components/navbar";
import Footer from "./shared-components/footer";
import { useEffect, useState } from "react";

const client = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 200;
      setIsScrolled(scrolled);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <QueryClientProvider client={client}>
      <NewsProvider>
        <Navbar isScrolled={isScrolled} />
        <Component {...pageProps} />
      </NewsProvider>
      <Footer />
    </QueryClientProvider>
  );
}
