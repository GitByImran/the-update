import Image from "next/image";
import React from "react";

const ErrorPage = () => {
  return (
    <div className="body-content">
      <div className="my-10 flex flex-col items-center">
        <div className="h-60 w-96 overflow-hidden">
          <Image
            src="/404.gif"
            alt="404.gif"
            height={300}
            width={500}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="w-full text-center text-gray-700">
          <h2 className="text-xl font-semibold ">Sorry | No Content Found</h2>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
