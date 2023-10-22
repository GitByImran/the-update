import React from "react";
import { UseAuthContext } from "../auth-provider/auth-provider";

const Dashboard = () => {
  const { user } = UseAuthContext();
  console.log(user);
  return (
    <div className="w-full h-60 flex justify-center items-center">
      <div className="max-w-xl border p-5 flex flex-col justify-center items-center gap-5">
        <h2 className="text-3xl">
          Welcome
          <span className="mx-2 text-blue-500 capitalize">
            {user?.displayName}!
          </span>
        </h2>
        <p className="text-center">
          You can view your accessable routes below the nav, you can go route
          through switching tabs
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
