import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

interface NewsData {
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

const NewsContext = createContext<NewsData[]>([]);

export const useNewsContext = () => {
  return useContext(NewsContext);
};

export const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  const { data, isLoading, isError } = useQuery(["news"], fetchData);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading news data</p>;
  }

  return <NewsContext.Provider value={data}>{children}</NewsContext.Provider>;
};

const fetchData = async () => {
  const response = await fetch("/news.json");
  const data = await response.json();
  return data;
};
