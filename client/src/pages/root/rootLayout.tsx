import React, { useEffect, useState } from "react";
import Navbar from "../shared-components/navbar";
import Home from "../routes/home";
import Categories from "../shared-components/nav-contents/categories";
import AllNews from "../news/all-news";

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
      <div className="flex" style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <div className="w-full basis-1/4 relative">
          <div className="fixed top-28 my-5 px-5">
            <Categories />
          </div>
        </div>
        <div className="w-full basis-1/1">
          <Home />
          <AllNews />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
