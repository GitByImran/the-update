import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { NewsProvider } from "./news-provider/news-provider";

const client = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={client}>
      <NewsProvider>
        <Component {...pageProps} />
      </NewsProvider>
    </QueryClientProvider>
  );
}
