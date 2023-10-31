import { BiArrowBack, BiTimeFive } from "react-icons/bi";
import React from "react";
import { useRouter } from "next/router";
import { useNewsContext } from "@/pages/news-provider/news-provider";
import Image from "next/image";

const ReportDetail: React.FC = () => {
  const router = useRouter();
  const { data: newsData } = useNewsContext();
  const { reportId } = router.query;

  const report = newsData.find((item) => String(item._id) === String(reportId));

  if (!report) {
    return <div>Report not found</div>;
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="body-content px-5">
      <div className="my-10">
        <div className="flex justify-between mb-10">
          <h2 className="text-2xl font-semibold border-b-4 border-blue-500 w-fit">
            Report Details
          </h2>
          <button
            onClick={handleGoBack}
            className="bg-blue-500 text-white px-5 py-2 hover-bg-blue-500 rounded flex items-center w-fit"
          >
            <BiArrowBack className="mr-2 mt-1" />
            Go Back
          </button>
        </div>
        <div>
          <Image
            src={report.news.image}
            alt="news-image"
            height={1000}
            width={1000}
            className="w-full
          h-96 overflow-hidden object-cover"
          />
          <div className="flex flex-col gap-3 my-10">
            <h2 className="text-xl font-semibold">{report.news.header}</h2>
            <p className="text-gray-500">{report.news.body}</p>
          </div>
          {report.reporter && (
            <div className="flex flex-col gap-5">
              <h2>Reported by -</h2>
              <div className="flex gap-3">
                <Image
                  src={
                    report.reporter.image.includes("https://")
                      ? report.reporter.image
                      : "/dummy.jpg"
                  }
                  alt="reporter-image"
                  height={100}
                  width={100}
                  className="h-14 w-14 rounded-full border"
                ></Image>
                <div>
                  <p className="text-lg font-bold capitalize text-gray-700">
                    {report.reporter.name}
                  </p>
                  <span>{report.reporter.position}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <span>
                  <BiTimeFive />
                </span>
                {report.reportTime}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
