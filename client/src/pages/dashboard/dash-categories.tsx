import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface CategoriesType {
  label: string;
  link: string;
}

const categories: CategoriesType[] = [
  { label: "reporter-profile", link: "editor-components/reporter-profile" },
  { label: "report-actions", link: "editor-components/report-actions" },
  { label: "report-form", link: "editor-components/report-form" },
];

const DashCategories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("");
  const router = useRouter();

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
      <div className="flex items-center gap-5 py-2">
        <ul className="flex gap-5 w-full">
          {categories.slice(0, categories.length).map((item, index) => (
            <li key={index}>
              <Link
                className={`capitalize text-lg hover:bg-blue-500 hover:text-white px-5 hover:py-2 ${
                  activeCategory === item.label
                    ? "border-b-4 border-blue-500 py-2"
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
