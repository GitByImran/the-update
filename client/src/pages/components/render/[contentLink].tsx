import { FaMehBlank } from "react-icons/fa";
import { useNewsContext } from "@/pages/news-provider/news-provider";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const ContentRender: React.FC = () => {
  const { data: newsdata } = useNewsContext();
  const router = useRouter();
  const { contentLink } = router.query;
  const filteredNews = newsdata.filter(
    (item) => item.news.category === contentLink
  );
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + "...";
  };

  return (
    <div className="">
      {filteredNews.length === 0 ? (
        <div className="h-60 w-full flex justify-center items-center gap-5">
          <div className="h-48 w-48 overflow-hidden rounded-full">
            <Image
              src="/no-content.gif"
              alt=""
              height={300}
              width={300}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="text-2xl">No content in this category.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10 my-10">
          {filteredNews.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-10">
              <div className="col-span-4 h-60 w-full overflow-hidden">
                <Image
                  src={item.news.image}
                  alt=""
                  height={1000}
                  width={1000}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="col-span-8">
                <h2 className="text-2xl font-semibold text-blue-500">
                  {item.news.header}
                </h2>
                <p className="my-5 text-lg">
                  {truncateText(item.news.body, 500)}
                </p>
                <Link
                  href={`/news/${item._id}`}
                  className="px-5 py-2 bg-blue-500 text-white font-semibold rounded"
                >
                  Read Full News
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentRender;
