import { BiLogInCircle } from "react-icons/bi";
import { BiHomeAlt2 } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import { IoIosTimer } from "react-icons/io";
import React, { useEffect, useState } from "react";
import moment from "moment";
import Search from "./nav-contents/search";
import Categories from "./nav-contents/categories";
import DashCategories from "../dashboard/dash-categories";
import Link from "next/link";

interface NavbarProps {
  isScrolled: boolean;
}

enum ActiveView {
  Home = "Home",
  Dashboard = "Dashboard",
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const [currentTime, setCurrentTime] = useState(
    moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
  );

  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.Home);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
  };

  return (
    <div className="shadow">
      <nav
        className={`bg-white  flex flex-col shadow px-5 ${
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

          <div className="flex gap-5">
            <Link
              href="/"
              className={`text-lg flex items-center gap-2 py-1 hover:border-b-4 hover:border-blue-500 ${
                activeView === ActiveView.Home
                  ? "border-b-4 border-blue-500"
                  : ""
              }`}
              onClick={() => handleViewChange(ActiveView.Home)}
            >
              <span className="mt-1">
                <BiHomeAlt2 />
              </span>
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`text-lg flex items-center gap-2 py-1 hover:border-b-4 hover:border-blue-500 ${
                activeView === ActiveView.Dashboard
                  ? "border-b-4 border-blue-500"
                  : ""
              }`}
              onClick={() => handleViewChange(ActiveView.Dashboard)}
            >
              <span className="mt-1">
                <RxDashboard />
              </span>
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className={`text-lg flex items-center gap-2 py-1 hover:border-b-4 hover:border-blue-500 ${
                activeView === ActiveView.Dashboard
                  ? "border-b-4 border-blue-500"
                  : ""
              }`}
              onClick={() => handleViewChange(ActiveView.Dashboard)}
            >
              <span className="mt-1">
                <BiLogInCircle />
              </span>
              Log In
            </Link>
          </div>

          <div>
            <Search isScrolled={isScrolled} />
          </div>
        </div>
        {activeView === ActiveView.Home && <Categories />}
        {activeView === ActiveView.Dashboard && <DashCategories />}
      </nav>
    </div>
  );
};

export default Navbar;
