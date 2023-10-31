import moment from "moment";
import Image from "next/image";
import React from "react";
import LatestNews from "../components/home/latest-news";
import InternationalNews from "../components/home/international-news";
import SuggestedNews from "../components/home/suggested-news";
import { useNewsContext } from "../news-provider/news-provider";

const Home: React.FC = () => {
  const { data: newsData } = useNewsContext();

  // Filter latest news
  const latestNews = newsData.filter((item) => {
    const publishedTime = moment(item.reportTime, "MMMM Do YYYY, h:mm:ss a");
    const currentTime = moment();
    const diffHours = currentTime.diff(publishedTime, "hours");

    return diffHours <= 24;
  });

  // Sort the latest news by reportTime in descending order
  const mostRecentNews = [...latestNews].sort((a, b) =>
    moment(b.reportTime, "MMMM Do YYYY, h:mm:ss a").diff(
      moment(a.reportTime, "MMMM Do YYYY, h:mm:ss a")
    )
  )[0]; // Select the first item

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
    <div>
      <main
        className="relative"
        style={{
          minHeight: "600px",
          overflow: "hidden",
          padding: "!important",
        }}
      >
        <div className="">
          <Image
            src={mostRecentNews ? mostRecentNews.news.image : ""}
            alt=""
            height={1000}
            width={1000}
            className="w-full object-cover"
            style={{ height: "600px" }}
          />
        </div>
        <div
          className="absolute top-0 h-full w-full flex flex-col justify-center"
          style={{ background: "rgba(0,0,0,.75)" }}
        >
          <div className="px-20 text-white">
            <h2 className="text-3xl font-bold mb-5">
              {mostRecentNews ? mostRecentNews.news.header : "No latest news"}
            </h2>
            <p className="max-w-3xl text-lg mb-5 text-gray-300">
              {mostRecentNews
                ? mostRecentNews.news.body
                : "No content available"}
            </p>
            <p className="text-gray-300">
              {mostRecentNews
                ? getPublishedTimeAgo(mostRecentNews.reportTime)
                : ""}
            </p>
          </div>
        </div>
      </main>
      <div className="px-5">
        <LatestNews />
        <InternationalNews />
        <SuggestedNews />
      </div>
    </div>
  );
};

export default Home;
