import React from "react";
import Home from "../routes/home";
import AllNews from "../news/all-news";

const RootLayout = () => {
  return (
    <div className="w-10/12 mx-auto">
      <Home />
      <AllNews />
    </div>
  );
};

export default RootLayout;
