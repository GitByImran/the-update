import React, { useEffect, useState } from "react";
import Home from "../routes/home";
import ContentRender from "../components/render/[contentLink]";

const RootLayout = () => {
  const [currentView, setCurrentView] = useState("home");

  const handleCategoryClick = () => {
    // Logic to handle category click and set the current view
    setCurrentView("contentRender");
  };

  return (
    <div className="body-content">
      {currentView === "home" && <Home />}
      {currentView === "contentRender" && <ContentRender />}
    </div>
  );
};

export default RootLayout;
