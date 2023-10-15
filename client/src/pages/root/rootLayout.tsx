import React from "react";
import Home from "../routes/home";
import AllNews from "../news/all-news";
import Navbar from "../shared-components/navbar";
import Footer from "../shared-components/footer";

const RootLayout = () => {
  return (
    <div className="">
      <Navbar />
      {/* <Home />
      <AllNews /> */}
      <Footer />
    </div>
  );
};

export default RootLayout;
