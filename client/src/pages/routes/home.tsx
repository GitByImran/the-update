import moment from "moment";
import Image from "next/image";
import React from "react";

const Home: React.FC = () => {
  return (
    <div>
      <main className="">
        <div className="relative h-full w-full">
          <Image
            src="https://i.ibb.co/yFSBLyH/pexels-kobe-1516440.jpg"
            alt=""
            height={300}
            width={500}
            className="h-screen w-full object-cover"
          />
        </div>
        <div
          className="absolute top-0 h-screen w-full flex flex-col justify-center"
          style={{ background: "rgba(0,0,0,.75)" }}
        >
          <div className="px-20 text-white">
            <h2 className="text-3xl font-bold mb-5 ">
              Lorem ipsum dolor sit amet.
            </h2>
            <p className="max-w-2xl mb-5 text-gray-300">
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
    </div>
  );
};

export default Home;
