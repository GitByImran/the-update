import { BiRightArrowAlt } from "react-icons/bi";
import React from "react";
import { useNewsContext } from "../news-provider/news-provider";
import Link from "next/link";
import Image from "next/image";

const AllNews = () => {
  const { data: newsData } = useNewsContext();

  return (
    <div className="">
      <h2 className="text-center my-5 text-3xl">All News</h2>
      <div className="grid grid-cols-12 gap-5">
        {newsData.map((item, index) => (
          <Link
            href="/news/[newsId]"
            as={`/news/${item._id}`}
            key={index}
            className="col-span-12 md:col-span-4 sm:col-span-6 border relative rounded-xl overflow-hidden"
          >
            <div className="pb-10">
              <Image
                src={item.news.image}
                alt="image_name"
                height={300}
                width={500}
              />
              <div className="p-5 flex flex-col justify-start gap-2 ">
                <h3 className="text-blue-500 font-semibold text-xl">
                  {item.news.header}
                </h3>
                <p className="truncate text-gray-500 text-md">
                  {item.news.body}
                </p>
                <Link
                  href=""
                  className="w-fit flex items-center gap-1 text-gray-500 hover:text-blue-500 hover:font-bold absolute bottom-5 right-5"
                >
                  Read more <BiRightArrowAlt />
                </Link>
                <p
                  className="font-bold text-gray-400 w-fit absolute bottom-5 left-5 block"
                  title="Category"
                >
                  # {item.news.category}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllNews;
