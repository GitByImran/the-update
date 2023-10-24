import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";

interface CategoriesType {
  label: string;
  link: string;
}

const categories: CategoriesType[] = [
  { label: "reporter-profile", link: "editor-components/reporter-profile" },
  { label: "report-actions", link: "editor-components/report-actions" },
  { label: "report-form", link: "editor-components/report-form" },
  { label: "manage-users", link: "admin/manage-users" },
];

const DashCategories: React.FC = () => {
  const [showCategory, setShowCategory] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState("");
  const router = useRouter();

  const handleToggle = () => {
    setShowCategory(!showCategory);
  };

  const handleCategoryClick = (label: string) => {
    setActiveCategory(label);
  };

  const handleHidecategory = () => {
    setShowCategory(!showCategory);
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
      <div>
        <button
          className="text-lg md:hidden flex items-center justify-center gap-2 w-full"
          onClick={handleToggle}
        >
          {showCategory
            ? "Hide Categories"
            : activeCategory
            ? activeCategory
            : "Show Categories"}
          <span
            className={`text-blue-500 mt-1.5 ${
              showCategory ? "rotate-180" : "rotate-0"
            }`}
          >
            <AiFillCaretDown />
          </span>
        </button>
      </div>
      <div className="relative flex items-center gap-5 py-2 md:justify-start justify-center">
        <ul
          className={`${
            showCategory
              ? "flex flex-col md:flex-row gap-2 w-fit p-5 md:py-0 md:-mx-4 h-fit absolute md:static top-10 shadow-2xl md:shadow-none border md:border-none z-10 bg-white rounded-lg md:rounded-none"
              : "hidden md:flex flex-row w-full"
          }`}
        >
          {categories.slice(0, categories.length).map((item, index) => (
            <li key={index} onClick={handleHidecategory}>
              <Link
                className={`capitalize text-lg hover:bg-blue-500 rounded hover:text-white px-5 hover:py-2 ${
                  activeCategory === item.label
                    ? "md:border-b-4 border-blue-500 py-2 rounded-none"
                    : ""
                }`}
                href={`/dashboard/${item.link}`}
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

export default DashCategories;
