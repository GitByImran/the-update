import React, { useEffect, useState } from "react";
import Navbar from "../shared-components/navbar";
import Home from "../routes/home";
import Categories from "../shared-components/nav-contents/categories";
import LatestNews from "../components/home/latest-news";
import InternationalNews from "../components/home/international-news";
import SuggestedNews from "../components/home/suggested-news";
import Footer from "../shared-components/footer";

const RootLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 200;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="">
      <Navbar isScrolled={isScrolled} />
      <div className="flex body-content">
        <div className="w-full h-screen basis-1/4 relative flex items-center">
          <div className="fixed my-5 ps-5 pe-10 border-r-2 border-blue-500">
            <Categories />
          </div>
        </div>
        <div className="w-full basis-5/5">
          <Home />
          <LatestNews />
          <InternationalNews />
          <SuggestedNews />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
