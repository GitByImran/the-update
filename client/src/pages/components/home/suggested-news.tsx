import { useNewsContext } from "@/pages/news-provider/news-provider";
import React, { useState, useRef, useCallback, useEffect } from "react";
import moment from "moment";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { BiRadioCircleMarked } from "react-icons/bi";

interface NewsItem {
  _id: number;
  news: {
    image: string;
    category: string;
    header: string;
    body: string;
  };
  reportTime: string;
}

const SuggestedNews: React.FC = () => {
  const { data: newsData, isLoading } = useNewsContext();
  const [visibleNews, setVisibleNews] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const totalNewsToShow = 5;

  const groupNewsByCategory = () => {
    const groupedNews: Record<string, NewsItem[]> = {};

    newsData?.forEach((item) => {
      const category = item.news.category;

      if (!groupedNews[category]) {
        groupedNews[category] = [];
      }

      groupedNews[category].push(item);
    });

    return groupedNews;
  };

  const suggestedNews = Object.entries(groupNewsByCategory()).reduce(
    (accumulator, [category, categoryNews]) => {
      const latestNews = categoryNews.slice(0, 1);
      const filteredNews = latestNews.filter((item) => {
        const uploadDate = moment(item.reportTime, "MMMM Do YYYY, h:mm:ss a");
        const daysAgo = moment().diff(uploadDate, "days");

        return daysAgo >= 1 && daysAgo <= 3;
      });

      if (filteredNews.length > 0) {
        accumulator[category] = filteredNews;
      }

      return accumulator;
    },
    {} as Record<string, NewsItem[]>
  );

  const latestNewsToday = newsData?.filter((item) => {
    const uploadDate = moment(item.reportTime, "MMMM Do YYYY, h:mm:ss a");
    const today = moment().startOf("day");
    const daysAgo = moment().diff(uploadDate, "days");

    return daysAgo === 0; // News uploaded today
  });
  console.log(latestNewsToday);

  const loadMoreNews = useCallback(() => {
    setIsLoadingMore(true);
    setTimeout(() => {
      if (visibleNews < totalNewsToShow) {
        setVisibleNews((prevVisibleNews) => prevVisibleNews + 1);
      }
      setIsLoadingMore(false);
    }, 1000);
  }, [visibleNews, totalNewsToShow]);

  const [inViewRef, inView] = useInView({
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && !isLoadingMore) {
      loadMoreNews();
    }
  }, [inView, isLoadingMore, loadMoreNews]);

  return (
    <div>
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8">
          <h2 className="text-2xl font-semibold my-10 border-b-4 border-blue-500 w-fit">
            More News
          </h2>
          <div className="flex flex-col gap-10">
            {Object.entries(suggestedNews).map(
              ([category, categoryNews], index) => {
                const suggested = categoryNews.slice(0, 1);

                return suggested.map((item) => (
                  <div key={index}>
                    <p className="text-blue-500 flex flex-row items-center gap-5 my-5">
                      <span className="w-fit bg-white capitalize">
                        {item.news.category}
                      </span>
                      <span className="w-full bg-red-green">
                        <hr />
                      </span>
                    </p>
                    <div className="flex flex-col gap-3">
                      <div className="h-96 w-full overflow-hidden">
                        <Image
                          src={item.news.image}
                          alt=""
                          height={1000}
                          width={1000}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="capitalize font-semibold text-2xl">
                        {item.news.header}
                      </h3>
                      <p>{item.news.body}</p>
                      <p className="text-gray-500 flex items-center gap-1">
                        <span className="text-blue-500 text-xl">
                          <BiRadioCircleMarked />
                        </span>
                        Uploaded{" "}
                        {moment(
                          item.reportTime,
                          "MMMM Do YYYY, h:mm:ss a"
                        ).fromNow(true)}
                        ago
                      </p>
                    </div>
                  </div>
                ));
              }
            )}
            {isLoading && <p>Loading...</p>}
            {visibleNews < totalNewsToShow && isLoadingMore && (
              <p>Loading more...</p>
            )}
            <div ref={inViewRef}></div>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex flex-col gap-10">
            <h2 className="text-2xl font-semibold my-10 border-b-4 border-blue-500 w-fit">
              Latest News Today
            </h2>
            {latestNewsToday.slice(0, 5).map((item, index) => (
              <div key={index}>
                <div className="h-40 w-full overflow-hidden">
                  <Image
                    src={item.news.image}
                    alt=""
                    height={300}
                    width={500}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1 my-5">
                  <h2>{item.news.header}</h2>
                  <p className="truncate">{item.news.body}</p>
                  <p className="text-gray-500 flex items-center gap-1">
                    <span className="text-blue-500 text-xl">
                      <BiRadioCircleMarked />
                    </span>
                    Uploaded{" "}
                    {moment(item.reportTime, "MMMM Do YYYY, h:mm:ss a").fromNow(
                      true
                    )}
                    ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestedNews;
