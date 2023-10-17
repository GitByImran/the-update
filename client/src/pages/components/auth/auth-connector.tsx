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
      <div>
        <Link
          href=""
          className="flex items-center gap-3 capitalize text-lg font-normal hover:bg-blue-500 hover:text-white hover:px-5 hover:py-2 rounded"
        >
          <span className="mt-0.5">
            <FiUserPlus />
          </span>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default AuthConnector;
