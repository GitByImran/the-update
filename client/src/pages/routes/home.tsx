import moment from "moment";
import Image from "next/image";
import React from "react";
import LatestNews from "../components/home/latest-news";
import InternationalNews from "../components/home/international-news";
import SuggestedNews from "../components/home/suggested-news";

const Home: React.FC = () => {
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
            src="https://i.ibb.co/yFSBLyH/pexels-kobe-1516440.jpg"
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
            <h2 className="text-3xl font-bold mb-5 ">
              Lorem ipsum dolor sit amet.
            </h2>
            <p className="max-w-3xl text-lg mb-5 text-gray-300">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel
              soluta odio voluptatem consectetur atque quaerat. Officia enim
              placeat iusto? Fugit corporis amet pariatur quo esse dolore harum
              doloribus recusandae voluptatem sapiente aspernatur quis similique
              voluptatum ratione tempora, totam unde molestiae quam? Laboriosam
              mollitia non tenetur, molestiae odit ipsum consectetur voluptatum.
            </p>
            <p className="text-gray-300">
              {moment().format("dddd, MMMM Do YYYY, h:mm:ss a")}
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
