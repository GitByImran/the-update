import React from "react";
import { useNewsContext } from "../news-provider/news-provider";
import Link from "next/link";

const AllNews = () => {
  const newsData = useNewsContext();

  return (
    <div>
      <h2>All News</h2>
      <div className="grid grid-cols-12 gap-5">
        {newsData.map((item, index) => (
          <Link
            href="#"
            className="col-span-12 md:col-span-4 sm:col-span-6 border p-5 relative"
          >
            <div
              key={index}
              className="flex flex-col justify-start gap-5 pb-10"
            >
              <h3>{item.news.header}</h3>
              <p>{item.news.body}</p>
              <p className="font-bold text-red-500 w-fit absolute bottom-5 left-5 block">
                # {item.news.category}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllNews;
