import { UseAuthContext } from "@/pages/auth-provider/auth-provider";
import Image from "next/image";
import React, { useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

interface UserData {
  name: string;
  email: string;
  image: string;
  role: string;
  totalReport: number;
  _id: string;
}

const ManageUsers = () => {
  const { userList, refetchUserData } = UseAuthContext();
  const availableRoles = ["user", "admin", "editor", "moderator"];
  console.log(userList);

  const getAvailableRoles = (user: any) => {
    return availableRoles.filter((role) => role !== user.role);
  };

  const handleRoleChange = (
    userId: string | undefined,
    newRole: string,
    name: string
  ) => {
    if (userId) {
      // Send an API request to update the user's role
      axios
        .patch<{ data: UserData }>(
          `http://localhost:8080/api/users/${userId}`,
          {
            role: newRole,
          }
        )
        .then((response) => {
          toast.success(`Done! Now ${name} is ${newRole}`);
          refetchUserData();
        })
        .catch((error) => {
          console.error("Error updating user role:", error);
        });
    } else {
      console.error("User is not defined or missing uid.");
    }
  };

  if (!userList) {
    console.log("User list not found");
  }

  return (
    <div className="body-content px-5 py-10">
      <div className="w-full flex justify-center">
        <h2 className="text-2xl font-semibold mb-10 border-b-4 border-blue-500 w-fit">
          Manage Users
        </h2>
      </div>
      <div>
        <div className="grid grid-cols-12 gap-10 my-10">
          {userList?.map((data, index) => (
            <div
              className="border col-span-12 sm:col-span-6 lg:col-span-4 px-5 mb-10 lg:mb-0"
              key={index}
            >
              <div className="h-20 w-20 rounded-full overflow-hidden z-10 -mt-10">
                <Image
                  src={data.image}
                  alt="User Profile"
                  width={500}
                  height={500}
                  className="border-2 rounded-full h-full w-full object-cover object-top"
                />
              </div>
              <div className="py-5">
                <h2 className="text-2xl capitalize font-semibold">
                  {data.name}
                </h2>
                <p className="text-gray-700 font-semibold">
                  Email: {data.email}
                </p>
                <p className="text-gray-700 font-semibold">
                  Current Role: {data.role}
                </p>
                <p className="text-gray-700 font-semibold">
                  Total reports : {data.totalReport}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {getAvailableRoles(data).map((role) => (
                  <button
                    key={role}
                    className="border rounded p-2 bg-blue-500 text-white font-semibold"
                    onClick={() => handleRoleChange(data._id, role, data.name)}
                  >
                    Make {role}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ManageUsers;
