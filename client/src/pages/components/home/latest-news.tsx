import { useNewsContext } from "@/pages/news-provider/news-provider";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import moment from "moment";
import { BiRadioCircleMarked } from "react-icons/bi";

const LatestNews: React.FC = () => {
  const { data: newsData } = useNewsContext();

  const latestNews = newsData.filter((item) => {
    const publishedTime = moment(item.reportTime, "MMMM Do YYYY, h:mm:ss a");
    const currentTime = moment();
    const diffHours = currentTime.diff(publishedTime, "hours");

    return diffHours <= 24;
  });

  const getPublishedTimeAgo = (reportTime: string) => {
    const publishedTime = moment(reportTime, "MMMM Do YYYY, h:mm:ss a");
    const currentTime = moment();
    const diffMinutes = currentTime.diff(publishedTime, "minutes");
    const diffHours = currentTime.diff(publishedTime, "hours");
    const diffDays = currentTime.diff(publishedTime, "days");

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="w-10/12 mx-auto">
      <div className="grid grid-cols-12 gap-5">
        {latestNews.slice(0, 3).map((item, index) => (
          <div
            className="col-span-12 md:col-span-4 bg-white p-5 border mb-20 md:mb-0 -mt-20 z-10"
            key={item._id}
          >
            <p className="mb-5 flex items-center gap-1">
              <span className="text-blue-500 text-xl">
                <BiRadioCircleMarked />
              </span>
              {getPublishedTimeAgo(item.reportTime)}
            </p>
            <Image
              src={item.news.image}
              alt={item.news.image}
              height={300}
              width={300}
              className="w-full h-32 object-cover"
            />
            <div className="flex flex-col gap-2 my-5">
              <h2 className="text-xl font-semibold text-blue-500">
                {item.news.header}
              </h2>
              <p className="truncate text-gray-500">{item.news.body}</p>
              <Link
                href="/news/[newsId]"
                as={`/news/${item._id}`}
                className="px-5 py-2 text-white bg-blue-500 text-center"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestNews;
