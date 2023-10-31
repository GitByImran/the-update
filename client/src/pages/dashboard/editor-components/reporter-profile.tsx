import { MdAddIcCall } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { HiOutlineMail } from "react-icons/hi";
import { BiBadgeCheck } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineFundView } from "react-icons/ai";
import { FaLevelUpAlt } from "react-icons/fa";
import { BiNews } from "react-icons/bi";
import { FaUpload } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { UseAuthContext } from "../../auth-provider/auth-provider";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNewsContext } from "@/pages/news-provider/news-provider";

interface UserData {
  name: string;
  email: string;
  role: string;
  image: string;
  totalReport: number;
  _id: string;
}

const ReporterProfile: React.FC = () => {
  const { user, handleImageChange, setUser } = UseAuthContext();
  const { data: newsData } = useNewsContext();
  const [imageUrl, setImageUrl] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [imageSaved, setimageSaved] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const getAllReport = (email: string) => {
    const userReports = newsData.filter(
      (news) => news.reporter.email === email
    );
    return userReports.length;
  };

  const fetchUserData = async (email: string) => {
    const response = await axios.get<UserData[]>(
      `http://localhost:8080/api/users`
    );
    const findUser = response.data.find((data) => data.email === email);
    return findUser;
  };

  const { data: foundUser, refetch } = useQuery<UserData | undefined>(
    ["userData"],
    () => fetchUserData(user?.email ?? "")
  );

  const updateUserImageMutation = useMutation<void, any, { image: string }>(
    (updates) =>
      axios.patch(`http://localhost:8080/api/users/${foundUser?._id}`, updates),
    {
      onMutate: (newData) => {
        const previousData = foundUser;
        return { previousData };
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["userData"]);
      },
    }
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        setUploadMessage("Uploading...");
        const url = await handleImageChange(file);
        setImageUrl(url);
        console.log(user);
        toast.success("Image uploaded successfully!");
        setUploadMessage("Upload Complete");
        console.log("refetching");
        refetch();
        setUploadComplete(true);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (user) {
          const updatedUser = {
            ...user,
            image: url,
          };
          setUser(updatedUser);
        }
        console.log(user);
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploadMessage("Error Uploading");
      }
    }
  };

  const handleSaveImage = async () => {
    if (user && foundUser) {
      try {
        setUploadMessage("Saving...");

        const updates: { image: string } = { image: imageUrl };
        await updateUserImageMutation.mutateAsync(updates);

        setImageUrl(updates.image);

        toast.success("Image saved successfully!");

        setUploadMessage("Image saved successfully");
        setTimeout(() => {
          setUploadMessage("");
        }, 3000);

        setimageSaved(true);
      } catch (error) {
        console.error("Error saving image:", error);
        setUploadMessage("Error saving image");
        setimageSaved(false);
      }
    }
  };

  const handleUpdateProfile = () => {
    setOpenModal(!openModal);
  };

  return (
    <div className="body-content px-5 py-10">
      <div className="w-full flex justify-center">
        <h2 className="text-2xl font-semibold mb-10 border-b-4 border-blue-500 w-fit">
          Reporter Profile
        </h2>
      </div>
      <div>
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-3 border flex flex-col items-center">
            <div className="w-full flex flex-col items-center">
              <div className="h-28 w-28 rounded-full border overflow-hidden">
                {user && user.photoURL && (
                  <Image
                    src={imageUrl ? imageUrl : user.photoURL}
                    alt="User Profile"
                    width={500}
                    height={500}
                    className="border-2 rounded-full h-full w-full object-cover object-top"
                  />
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="fileInput"
                  accept=".jpg, .jpeg, .png"
                  title="select image to upload"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <label
                  htmlFor="fileInput"
                  style={{ cursor: "pointer" }}
                  className="flex items-center gap-2 mt-2"
                >
                  <span className="text-blue-500 ">
                    <FaUpload />
                  </span>
                  <span className="border-transparent border-b-2 hover:border-blue-500">
                    Select New Image
                  </span>
                </label>
                {uploadMessage && imageSaved && (
                  <p className="my-1">{uploadMessage}</p>
                )}
                {uploadComplete && !imageSaved && (
                  <button
                    onClick={handleSaveImage}
                    className="bg-blue-500 text-white font-semibold px-5 py-2 mt-2 rounded"
                  >
                    Save Image
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full p-5">
              <p className="capitalize text-center text-xl font-bold text-gray-700">
                {user?.displayName}
              </p>
              <p className="flex items-center text-lg capitalize gap-3">
                <span className="">
                  <BiBadgeCheck />
                </span>
                {foundUser?.role}
              </p>

              <p className="flex items-center text-lg gap-3">
                <span className="mt-1">
                  <HiOutlineMail />
                </span>
                {user?.email}
              </p>
            </div>
          </div>

          <div className="col-span-9">
            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-4 border text-black shadow-lg py-10 rounded-lg text-lg capitalize flex flex-col items-center gap-5">
                <span className="text-5xl mt-1">
                  <BiNews />
                </span>
                <span>Total report : {getAllReport(user?.email || "")}</span>
              </div>
              <div className="col-span-4 border text-black shadow-lg py-10 rounded-lg text-lg capitalize flex flex-col items-center gap-5">
                <span className="text-5xl mt-1">
                  <AiOutlineFundView />
                </span>
                <span>Total view : 5000</span>
              </div>
              <div className="col-span-4 border text-black shadow-lg py-10 rounded-lg text-lg capitalize flex flex-col items-center gap-5">
                <span className="text-5xl mt-1">
                  <FaLevelUpAlt />
                </span>
                <span>Promotion : available</span>
              </div>
            </div>
            <div className="flex flex-col gap-5 my-10">
              <h2 className="font-semibold text-lg text-gray-700 flex items-center gap-2">
                <span className="mt-1">
                  <IoSettingsOutline />
                </span>{" "}
                Actions
              </h2>
              <div className="p-5 bg-gray-100">
                <div className="border-l-4 border-emerald-500 px-5 py-2">
                  <p className="font-semibold text-gray-500 mb-3">
                    If you are eligible to get promotion click request here to
                    get admin review
                  </p>
                  <button className="bg-emerald-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-700 delay-0">
                    Request to be admin
                  </button>
                </div>
              </div>
              <div className="p-5 bg-gray-100">
                <div className="border-l-4 border-red-500 px-5 py-2">
                  <p className="font-semibold text-gray-500 mb-3">
                    If you delete this account once, you will not get it back
                    again. All of activities will remove excepts reports.
                  </p>
                  <button className="bg-red-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-700 delay-0">
                    Delete my account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ReporterProfile;
