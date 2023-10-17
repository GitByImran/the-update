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
  _id: number;
  reportTime: string;
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
  isLoading: boolean;
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

  const contextValue: NewsContextValue = { data, refetch, isLoading };

  return (
    <QueryClientProvider client={queryClient}>
      <NewsContext.Provider value={contextValue}>
        {children}
      </NewsContext.Provider>
    </QueryClientProvider>
  );
};

const fetchData = async () => {
  const response = await fetch("http://localhost:8080/api/reports");
  // const response = await fetch("/news.json");
  const data = await response.json();
  return data;
};

export default NewsProvider;
