import React from "react";
import { UseAuthContext } from "../auth-provider/auth-provider";
import { useRouter } from "next/router";

const Dashboard = () => {
  const { user } = UseAuthContext();
  const router = useRouter();
  if (!user) {
    router.push("/components/auth/login");
    return null;
  }
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
