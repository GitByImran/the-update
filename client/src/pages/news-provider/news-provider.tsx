import React, { createContext, useContext } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
  RefetchOptions,
  RefetchQueryFilters,
  QueryObserverResult,
} from "@tanstack/react-query";

interface NewsData {
  id: number;
  news: {
    image: string;
    category: string;
    header: string;
    body: string;
    tags: string[];
  };
  reporter: {
    image: string;
    name: string;
    position: string;
  };
}

interface NewsProviderProps {
  children: React.ReactNode;
}

interface NewsContextValue {
  data: NewsData[];
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>;
}

const NewsContext = createContext<NewsContextValue | undefined>(undefined);

export const useNewsContext = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNewsContext must be used within a NewsProvider");
  }
  return context;
};

const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  const queryClient = new QueryClient();

  const { data, isLoading, isError, refetch } = useQuery(["news"], fetchData);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading news data</p>;
  }

  const contextValue: NewsContextValue = { data, refetch };

  return (
    <QueryClientProvider client={queryClient}>
      <NewsContext.Provider value={contextValue}>
        {children}
      </NewsContext.Provider>
    </QueryClientProvider>
  );
};

const fetchData = async () => {
  const response = await fetch("/news.json");
  const data = await response.json();
  return data;
};

export default NewsProvider;
