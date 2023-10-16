import { CgChevronDown, CgChevronUp } from "react-icons/cg";
import Link from "next/link";
import React, { useState } from "react";

interface CategoriesType {
  label: string;
  link: string;
}

const categories: CategoriesType[] = [
  { label: "politics", link: "#" },
  { label: "entertain", link: "#" },
  { label: "sports", link: "#" },
  { label: "international", link: "#" },
  { label: "carrier", link: "#" },
  { label: "business", link: "#" },
  { label: "technology", link: "#" },
];

const Categories: React.FC = () => {
  // const [seeMore, setSeeMore] = useState(false);
  // const handleSeeMore = () => {
  //   setSeeMore(!seeMore);
  // };
  return (
    <div className="">
      <h2 className="my-5">Select categories : </h2>
      <ul className="flex flex-col gap-2">
        {categories.slice(0, 7).map((item, index) => (
          <li key={index}>
            <Link className="capitalize" href={item.link}>
              {item.label}
            </Link>
          </li>
        ))}
        {/* <li onClick={handleSeeMore} className="">
          <button className="flex items-center gap-2">
            See more
            {seeMore ? <CgChevronUp /> : <CgChevronDown />}
          </button>
          <div
            className={`bg-white p-5 border mt-5 flex flex-col rounded-b-xl ${
              !seeMore && "hidden"
            }`}
          >
            {seeMore && (
              categories.slice(3, categories.length).map((item, index) => (
                <Link
                  href={item.link}
                  key={index}
                  className="px-5 py-2 rounded-lg hover:bg-blue-500 text-black hover:text-white delay-0 transition-all"
                >
                  {item.label}
                </Link>
              ))
              <p className="w-max text-black">no more categories</p>
            )}
          </div>
        </li> */}
      </ul>
    </div>
  );
};

export default Categories;
