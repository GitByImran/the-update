import React from "react";
import { useRouter } from "next/router";
import { useNewsContext } from "@/pages/news-provider/news-provider";

const ReportDetail: React.FC = () => {
  const router = useRouter();
  const { data: newsData } = useNewsContext();
  const { reportId } = router.query;

  const report = newsData.find((item) => String(item._id) === String(reportId));

  if (!report) {
    return <div>Report not found</div>;
  }

  return (
    <div>
      <h2>Report Details</h2>
      <div>
        <h2 className="text-xl font-semibold">{report.news.header}</h2>
        <p className="text-gray-500">{report.news.body}</p>
        <span>October 13th 2023, 12:24:36 am</span>
      </div>
    </div>
  );
};

export default ReportDetail;
