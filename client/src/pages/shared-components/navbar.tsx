import { HiBars3CenterLeft } from "react-icons/hi2";
import { BiLogInCircle } from "react-icons/bi";
import { BiHomeAlt2 } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import { IoIosTimer } from "react-icons/io";
import React, { useEffect, useState, useContext } from "react";
import moment from "moment";
import Search from "./nav-contents/search";
import Categories from "./nav-contents/categories";
import DashCategories from "../dashboard/dash-categories";
import Link from "next/link";
import { UseAuthContext } from "../auth-provider/auth-provider";
import { useRouter } from "next/router";

interface NavbarProps {
  isScrolled: boolean;
  showRoute: boolean;
}

enum ActiveView {
  Home = "Home",
  Dashboard = "Dashboard",
  Login = "login",
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.Home);
  const { user, handleSignOut } = UseAuthContext();
  const [showRoute, setShowRoute] = useState<boolean>(false);
  const router = useRouter();

  const [currentTime, setCurrentTime] = useState(
    moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
  );
  useEffect(() => {
    const currentPath = router.asPath;

    if (currentPath === "/components/render") {
      setActiveView(ActiveView.Home);
    } else if (currentPath.includes("/dashboard")) {
      setActiveView(ActiveView.Dashboard);
    } else if (currentPath.includes("/components/auth")) {
      setActiveView(ActiveView.Login);
    }
  }, [router]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
    setShowRoute(false);
  };

  const handleRouteToggle = () => {
    setShowRoute(!showRoute);
  };

  return (
    <div className="shadow">
      <nav
        className={`relative bg-white  flex flex-col shadow px-5 ${
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

          <div
            className={` ${
              showRoute
                ? "flex flex-col gap-5 lg:hidden absolute top-24 right-5 rounded-lg h-40 w-6/12 px-5 bg-blue-500 text-white z-20"
                : "lg:flex flex-row gap-5 hidden"
            }`}
          >
            <div
              className={`${
                showRoute ? "flex flex-col" : "flex flex-row gap-5"
              }`}
            >
              <Link
                href="/"
                className={`text-lg flex items-center gap-2 py-1 hover:border-b-4 hover:border-blue-500 ${
                  activeView === ActiveView.Home
                    ? showRoute
                      ? "border-b-2 border-white w-fit"
                      : "border-b-4 border-blue-500"
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
                    ? showRoute
                      ? "border-b-2 border-white w-fit"
                      : "border-b-4 border-blue-500"
                    : ""
                }`}
                onClick={() => handleViewChange(ActiveView.Dashboard)}
              >
                <span className="mt-1">
                  <RxDashboard />
                </span>
                Dashboard
              </Link>
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="text-lg flex items-center gap-2 py-1 hover:border-b-4 hover:border-blue-500"
                >
                  <span className="mt-1">
                    <BiLogInCircle />
                  </span>
                  Logout
                </button>
              ) : (
                <Link
                  href="/components/auth/login"
                  className={`text-lg flex items-center gap-2 py-1 hover:border-b-4 hover:border-blue-500 ${
                    activeView === ActiveView.Login
                      ? showRoute
                        ? "border-b-2 border-white w-fit"
                        : "border-b-4 border-blue-500"
                      : ""
                  }`}
                  onClick={() => handleViewChange(ActiveView.Login)}
                >
                  <span className="mt-1">
                    <BiLogInCircle />
                  </span>
                  Log In
                </Link>
              )}
            </div>

            <div>
              <Search isScrolled={isScrolled} showRoute={showRoute} />
            </div>
          </div>
          <div className="lg:hidden block z-50">
            <button
              className="text-2xl font-bold h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full delay-75 hover:text-3xl"
              onClick={handleRouteToggle}
            >
              <HiBars3CenterLeft />
            </button>
          </div>
        </div>

        {activeView === ActiveView.Home && <Categories />}
        {activeView === ActiveView.Dashboard && <DashCategories />}
      </nav>
    </div>
  );
};

export default Navbar;
