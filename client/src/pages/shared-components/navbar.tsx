import { IoIosTimer } from "react-icons/io";
import { CiViewTimeline } from "react-icons/ci";
import React, { useEffect, useState } from "react";
import moment from "moment";
import Search from "./nav-contents/search";
import Categories from "./nav-contents/categories";

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const [currentTime, setCurrentTime] = useState(
    moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="shadow relative">
      <div className="shadow-lg">
        <nav
          className={`bg-white fixed top-0 left-0 right-0 z-50 flex flex-col shadow px-5 ${
            isScrolled ? "gap-5 py-5" : "gap-5 py-5"
          }`}
        >
          <div className="flex items-center justify-between main-navbar w-full">
            <div>
              <div className="logo">
                <h2 className="uppercase text-3xl font-extrabold text-blue-500 tracking-wider">
                  the update
                </h2>
              </div>
              <div>
                <p className="flex items-center gap-1 pt-2 text-gray-500">
                  <span className="text-lg">
                    <IoIosTimer />
                  </span>
                  <span className="font-bold text-sm">{currentTime}</span>
                </p>
              </div>
            </div>

            <div>
              <Search isScrolled={isScrolled} />
            </div>
          </div>
          {/* <Categories isScrolled={isScrolled} /> */}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
