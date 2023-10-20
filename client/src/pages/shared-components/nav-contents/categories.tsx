import { CgChevronDown, CgChevronUp } from "react-icons/cg";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface CategoriesType {
  label: string;
  link: string;
}

const categories: CategoriesType[] = [
  // include this into user array
  { label: "politics", link: "render/politics" },
  { label: "entertain", link: "render/entertain" },
  { label: "sports", link: "render/sports" },
  { label: "international", link: "render/international" },
  { label: "carrier", link: "render/carrier" },
  { label: "business", link: "render/business" },
  { label: "technology", link: "render/technology" },
];

const Categories: React.FC = () => {
  const [seeMore, setSeeMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const router = useRouter();

  const handleSeeMore = () => {
    setSeeMore(!seeMore);
  };

  const handleCategoryClick = (label: string) => {
    setActiveCategory(label);
  };

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const categoryLabel = url.split("/").pop();
      setActiveCategory(categoryLabel || "");
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <div className="w-full body-content">
      <div className="flex  items-center gap-5 py-2">
        <ul className="flex justify-between gap-2 w-full">
          {categories.slice(0, categories.length).map((item, index) => (
            <li key={index}>
              <Link
                className={`capitalize text-lg hover:bg-blue-500 hover:text-white px-5 hover:py-2 ${
                  activeCategory === item.label
                    ? "border-b-4 border-blue-500 py-2"
                    : ""
                }`}
                href={`/components/${item.link}`}
                onClick={() => handleCategoryClick(item.label)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Categories;

/* use if need --------------------------------------------------------------------------->

<li onClick={handleSeeMore} className="relative">
            <button className="text-lg flex items-center gap-2">
              See more
              {seeMore ? <CgChevronUp /> : <CgChevronDown />}
            </button>
            <div className="absolute right-0 top-10">
              <div
                className={`bg-white text-lg p-5 border  flex flex-col rounded-b-xl ${
                  !seeMore && "hidden"
                }`}
              >
                {
                  seeMore &&
                    categories
                      .slice(7, categories.length)
                      .map((item, index) => (
                        <Link
                          href={item.link}
                          key={index}
                          className="px-5 py-2 rounded-lg hover:bg-blue-500 text-black hover:text-white delay-0 transition-all"
                        >
                          {item.label}
                        </Link>
                      ))
                  // <p className="w-max text-black">no more categories</p>
                }
              </div>
            </div>
          </li>

*/
