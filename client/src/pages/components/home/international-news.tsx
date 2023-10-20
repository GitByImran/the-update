import { BiRadioCircleMarked } from "react-icons/bi";
import { useNewsContext } from "@/pages/news-provider/news-provider";
import moment from "moment-timezone";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const InternationalNews: React.FC = () => {
  const { data: newsData } = useNewsContext();

  const getInternationalNews = newsData.filter(
    (item) => item.news.category === "international"
  );

  const sortedInternationalNews = getInternationalNews.sort((a, b) => {
    const timeA: Date = moment
      .tz(a.reportTime, "MMMM Do YYYY, h:mm:ss a", "Asia/Dhaka")
      .toDate();
    const timeB: Date = moment
      .tz(b.reportTime, "MMMM Do YYYY, h:mm:ss a", "Asia/Dhaka")
      .toDate();
    return timeB.getTime() - timeA.getTime();
  });

  const latestInternationalNews = sortedInternationalNews[0];

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

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
    <div className="my-10">
      <h2 className="text-2xl font-semibold my-10 border-b-4 border-blue-500 w-fit">
        Latest International News
      </h2>
      <main className="flex items-center justify-between gap-10">
        <div className="basis-1/2">
          <h2 className="text-2xl font-semibold text-blue-500">
            {latestInternationalNews.news.header}
          </h2>
          <div className="my-5 flex flex-col items-start gap-2">
            <p
              className="text-lg"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "pre-wrap",
              }}
            >
              {truncateText(latestInternationalNews.news.body, 500)}
            </p>
            <Link
              href="/news/[newsId]"
              as={`/news/${latestInternationalNews._id}`}
              className="px-5 py-2 text-white bg-blue-500 text-center"
            >
              Read More
            </Link>
          </div>
          <p className="font-bold text-gray-500 flex items-center gap-1">
            <span className="text-blue-500 text-xl">
              <BiRadioCircleMarked />
            </span>
            {getPublishedTimeAgo(latestInternationalNews.reportTime)}
          </p>
        </div>
        <div className="basis-1/1 bg-red-500">
          <Image
            src={latestInternationalNews.news.image}
            alt="international-news-image"
            height={300}
            width={500}
            className="w-full"
          />
        </div>
      </main>
    </div>
  );
};

export default InternationalNews;
