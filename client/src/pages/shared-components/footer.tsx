import { RiCopyrightFill } from "react-icons/ri";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="body-content">
      <div className="my-10">
        {/*  */}
        <div className="flex justify-between w-full py-10">
          <div className="flex flex-col items-center basis-1/3 p-5">
            <span>Email Us</span>
            <Link href="mailto:the-update@gmail.com">the-update@gmail.com</Link>
          </div>
          <div className="flex flex-col items-center basis-1/3 p-5 border-r-2 border-l-2 border-blue-500">
            <span>Reach Us</span>
            <div className="flex gap-3">
              <Link href="" className="text-3xl text-blue-500">
                <FaFacebookSquare />
              </Link>
              <Link href="" className="text-3xl text-blue-500">
                <FaTwitterSquare />
              </Link>
              <Link href="" className="text-3xl text-blue-500">
                <FaLinkedin />
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center basis-1/3 p-5">
            <span>Contact Us</span>
            <Link href="texl:+8801234567890">+8801234567890</Link>
          </div>
        </div>
        {/*  */}
        <div>
          <center className="flex flex-col items-center justify-center">
            <h2 className="uppercase text-3xl font-extrabold text-blue-500 tracking-wider">
              the update
            </h2>
            <p className="text-gray-500 flex items-center gap-2">
              <span className="text-blue-500">
                <RiCopyrightFill />
              </span>{" "}
              All right reserved
            </p>
          </center>
        </div>
      </div>
    </div>
  );
};

export default Footer;
