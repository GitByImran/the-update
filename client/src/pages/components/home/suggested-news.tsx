import { useNewsContext } from "@/pages/news-provider/news-provider";
import React, { useState, useRef, useCallback, useEffect } from "react";
import moment from "moment";
import { useInView } from "react-intersection-observer";

const SuggestedNews: React.FC = () => {
  const { data: newsData, isLoading } = useNewsContext();
  const [visibleNews, setVisibleNews] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const totalNewsToShow = 5;

  const suggestedNews =
    newsData?.filter((item) => {
      const uploadDate = moment(item.reportTime, "MMMM Do YYYY, h:mm:ss a");
      const daysAgo = moment().diff(uploadDate, "days");

      return daysAgo >= 1 && daysAgo <= 2;
    }) || [];

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
    console.log("useEffect triggered");
    if (inView && !isLoadingMore) {
      loadMoreNews();
    }
  }, [inView, isLoadingMore, loadMoreNews]);

  return (
    <div>
      <h2 className="text-2xl font-semibold my-10 border-b-4 border-blue-500 w-fit">
        More News
      </h2>
      <div className="flex flex-col gap-10">
        {suggestedNews.slice(0, visibleNews).map((item, index) => (
          <div key={item._id}>
            <h3>{item.news.header}</h3>
            <p>{item.news.body}</p>
          </div>
        ))}
        {isLoading && <p>Loading...</p>}
        {visibleNews < totalNewsToShow && isLoadingMore && (
          <p>Loading more...</p>
        )}
        <div ref={inViewRef}></div>
      </div>
    </div>
  );
};

export default SuggestedNews;
