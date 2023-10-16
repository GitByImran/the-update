import { CgSearch } from "react-icons/cg";
import React from "react";

interface SearchProps {
  isScrolled: boolean;
}

const Search: React.FC<SearchProps> = ({ isScrolled }) => {
  return (
    <div className="">
      <div className="search flex items-center h-14 rounded-lg overflow-hidden">
        <input
          type="text"
          className="text-lg h-full w-full outline-none px-5 border rounded-s-lg"
          placeholder="Search news here"
        />
        <button className="text-3xl h-full w-20 flex items-center justify-center bg-blue-500 text-white font-bold">
          <CgSearch />
        </button>
      </div>
    </div>
  );
};

export default Search;
