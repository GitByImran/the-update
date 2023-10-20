import { FiUserPlus } from "react-icons/fi";
import { BsLink } from "react-icons/bs";
import React from "react";
import Link from "next/link";

const AuthConnector = () => {
  return (
    <div className="my-5">
      <h2 className="mb-5 text-lg text-gray-500 flex items-center justify-between gap-3 w-full">
        Auth-connector
        <span className="mt-1 text-2xl">
          <BsLink />
        </span>
      </h2>
      <div className="flex flex-col">
        <Link
          href=""
          className="py-1 flex items-center gap-3 capitalize text-lg font-normal hover:bg-blue-500 hover:text-white hover:px-5 rounded"
        >
          <span className="mt-0.5">
            <FiUserPlus />
          </span>
          Sign In
        </Link>
        <Link
          href=""
          className="py-1 flex items-center gap-3 capitalize text-lg font-normal hover:bg-blue-500 hover:text-white hover:px-5  rounded"
        >
          <span className="mt-0.5 h-10 w-10 border-white border-2 bg-blue-500 rounded-full"></span>
          My Tools
        </Link>
      </div>
    </div>
  );
};

export default AuthConnector;
