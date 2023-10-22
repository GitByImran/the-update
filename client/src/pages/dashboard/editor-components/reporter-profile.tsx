import { AiFillEdit } from "react-icons/ai";
import { FaUpload } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { UseAuthContext } from "../../auth-provider/auth-provider";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

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
  const [imageUrl, setImageUrl] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

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
        toast.success("Image uploaded successfully!");
        setUploadMessage("Upload Complete");
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
      } catch (error) {
        console.error("Error saving image:", error);
        setUploadMessage("Error saving image");
      }
    }
  };

  return (
    <div className="body-content px-5">
      <h2>Reporter Profile</h2>
      <div>
        <div className="w-20">
          <div className="h-20 w-20 rounded-full overflow-hidden">
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
        </div>
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
        {uploadMessage && <p className="my-1">{uploadMessage}</p>}
        {uploadComplete && (
          <button
            onClick={handleSaveImage}
            className="bg-blue-500 text-white font-semibold px-5 py-2 rounded"
          >
            Save Image
          </button>
        )}
        <p>{foundUser?.role}</p>
        <p>{user?.displayName}</p>
        <p>{user?.email}</p>
        <p>total report : {foundUser?.totalReport}</p>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ReporterProfile;
