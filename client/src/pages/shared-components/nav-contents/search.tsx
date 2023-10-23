import { CgSearch } from "react-icons/cg";
import React, { useState, useEffect } from "react";
import { useNewsContext } from "@/pages/news-provider/news-provider";
import Link from "next/link";
import { motion } from "framer-motion"; // Import motion

interface SearchProps {
  isScrolled: boolean;
  showRoute: boolean;
}

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

const Search: React.FC<SearchProps> = ({ isScrolled, showRoute }) => {
  const { data: newsData } = useNewsContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NewsData[]>([]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    // Ensure newsData is available and search query is not empty
    if (newsData && query.trim() !== "") {
      const results = newsData.filter((news: NewsData) =>
        news.news.header.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      // If no query, clear the search results
      setSearchResults([]);
    }
  };

  return (
    <div className="relative">
      <div
        className={`search text-black flex items-center h-14 rounded-lg overflow-hidden ${
          showRoute ? "border" : "border-none"
        }`}
      >
        <input
          type="text"
          className="text-lg h-full w-full outline-none px-5 border rounded-s-lg"
          placeholder="Search news here"
          value={searchQuery}
          onChange={(e) => {
            const query = e.target.value;
            setSearchQuery(query);
          }}
        />
        <button className="text-3xl h-full w-20 flex items-center justify-center bg-blue-500 text-white font-bold">
          <CgSearch />
        </button>
      </div>
      <div className="absolute bg-white w-full mt-5">
        <motion.ul>
          {searchResults.map((result, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link href="">{result.news.header}</Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
};

export default Search;
