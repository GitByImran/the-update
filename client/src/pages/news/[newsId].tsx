import { BiRightArrowAlt } from "react-icons/bi";
import { BsFillClockFill } from "react-icons/bs";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { useNewsContext } from "../news-provider/news-provider";
import Image from "next/image";
import Link from "next/link";

const NewsDetail = () => {
  const router = useRouter();
  const { newsId } = router.query;
  const { data: newsData } = useNewsContext();

  const selectedItem = newsData.find(
    (item) => String(item._id) === String(newsId)
  );

  if (!selectedItem) {
    return <p>Loading...</p>;
  }
  return (
    <div className="w-10/12 mx-auto">
      <div className="grid grid-cols-12 gap-5 my-20">
        <div className="col-span-12 lg:col-span-8 border p-5">
          <div className="flex items-center justify-between">
            <div className="reporter-info flex items-center gap-3">
              {/* <div className="h-16 w-16 bg-gray-300 overflow-hidden rounded-full">
                <Image
                  src={selectedItem.reporter.image}
                  alt=""
                  height={100}
                  width={100}
                  className="h-full w-full object-cover object-top"
                />
              </div> */}
              <div className="">
                <h2 className="text-2xl font-semibold text-blue-500">
                  {selectedItem.reporter.name}
                </h2>
                <h2 className="text-gray-500">
                  {selectedItem.reporter.position}
                </h2>
              </div>
            </div>
            <div className="reported-time flex flex-col">
              <p className="text-md text-gray-500 flex items-center gap-1">
                <BsFillClockFill /> 12:00 AM
              </p>
              <p className="text-md text-gray-500 flex items-center gap-1">
                <BsFillCalendarCheckFill /> 01-01-2023
              </p>
            </div>
          </div>
          <div className="detailed-news mt-10 flex flex-col gap-5">
            <h2 className="text-2xl font-semibold">
              {selectedItem.news.header}
            </h2>
            <p className="text-lg">{selectedItem.news.body}</p>
          </div>
          <div className="tags flex gap-2 mt-10">
            {selectedItem.news.tags.map((tag, index) => (
              <span key={index} className="px-2 text-gray-500 font-semibold">
                # {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 border p-5">
          <h2>Most recent</h2>
          <div className="latest-published-news mt-5 flex flex-col lg:flex-col sm:flex-row gap-5 ">
            {newsData.slice(0, 3).map((item, index) => (
              <Link
                className="basis-full border p-2 relative hover:bg-gray-100"
                href={`/news/${item._id}`}
                key={index}
                passHref
              >
                <h2 className="font-semibold text-blue-500 mb-10">
                  {item.news.header}
                </h2>
                <p className="text-gray-500 font-semibold flex items-center gap-2 absolute bottom-2 left-2">
                  Read it
                  <BiRightArrowAlt />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
