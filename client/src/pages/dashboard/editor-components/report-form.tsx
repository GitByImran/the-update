import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { UseAuthContext } from "@/pages/auth-provider/auth-provider";
import Image from "next/image";

interface ReportFormProps {}

interface FormData {
  news: {
    image: string;
    category: string;
    header: string;
    body: string;
    tags: string[];
  };
  reporter: {
    image: string;
    name: string;
    email: string;
    position: string;
  };
}

interface UserData {
  name: string;
  email: string;
  image: string;
  role: string;
  totalReport: number;
  _id: string;
}

const ReportForm: React.FC<ReportFormProps> = () => {
  const { user, userList } = UseAuthContext();
  const [userData, setUserData] = useState<UserData | undefined>(undefined);

  useEffect(() => {
    const getUserData = userList?.find(
      (userData) => userData.email === user?.email
    );
    setUserData(getUserData);
  }, [user, userList]);

  console.log(userData);

  const [formData, setFormData] = useState<FormData>({
    news: {
      image: "",
      category: "",
      header: "",
      body: "",
      tags: [],
    },
    reporter: {
      image: userData?.image || "",
      name: userData?.name || "",
      email: userData?.email || "",
      position: userData?.role || "",
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      news: {
        ...prevData.news,
        [name]: value,
      },
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      news: {
        ...prevData.news,
        category,
      },
    }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",");

    setFormData((prevData) => ({
      ...prevData,
      news: {
        ...prevData.news,
        tags,
      },
    }));
  };

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setIsUploading(true);

      try {
        // Upload the file to imgbb
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_API}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        const imageUrl = data.data.url;

        setFormData((prevData) => ({
          ...prevData,
          news: {
            ...prevData.news,
            image: imageUrl,
          },
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/reports", {
        news: formData.news,
        reporter: {
          image: userData?.image,
          name: userData?.name,
          email: userData?.email,
          position: userData?.role,
        },
      });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
      setFormData({
        news: {
          image: "",
          category: "",
          header: "",
          body: "",
          tags: [],
        },
        reporter: {
          image: userData?.image || "",
          name: userData?.name || "",
          email: userData?.email || "",
          position: userData?.role || "",
        },
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <div className="body-content py-10 px-5">
      <div className="w-full flex justify-center">
        <h2 className="text-2xl font-semibold mb-10 border-b-4 border-blue-500 w-fit">
          Report Form
        </h2>
      </div>
      <div className="w-full md:w-8/12 mx-auto border shadow-lg p-5">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div>
                <label className="text-lg mr-1">News Image :</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  required
                />
                {isUploading && <p className="block ml-2">Uploading...</p>}
              </div>
              <div className="text-red-500 text-sm">
                {formData.news.image === "" && "News image is required"}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-fit">
              <label className="text-lg">Category:</label>
              <select
                name="category"
                value={formData.news.category}
                onChange={handleCategoryChange}
                className="px-5 py-2 border"
                required={true}
              >
                <option value="">Select Category</option>
                <option value="politics">Politics</option>
                <option value="entertain">Entertain</option>
                <option value="sports">Sports</option>
                <option value="international">International</option>
                <option value="carrier">Carrer</option>
                <option value="business">Business</option>
                <option value="technology">Technology</option>
              </select>
              {formData.news.category === "" && (
                <div className="text-red-500 text-sm">Category is required</div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">Header:</label>
              <input
                type="text"
                name="header"
                value={formData.news.header}
                onChange={handleInputChange}
                className="border-2 rounded-md p-2 outline-blue-500"
                required
              />
              <div className="text-red-500 text-sm">
                {formData.news.header === "" && "Header is required"}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">Body:</label>
              <textarea
                name="body"
                value={formData.news.body}
                onChange={handleInputChange}
                className="border-2 rounded-md p-2 outline-blue-500"
                required
              />
              <div className="text-red-500 text-sm">
                {formData.news.body === "" && "Body is required"}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">
                Tags:
                <span className="ml-2 text-gray-500 text-sm">
                  [ Use comma(',') between each tag. EX- test1, test2, test3 ]
                </span>
              </label>
              <input
                type="text"
                name="tags"
                value={formData.news.tags}
                onChange={handleTagChange}
                className="border-2 rounded-md p-2 outline-blue-500"
                required
              />
              <div className="text-red-500 text-sm">
                {formData.news.tags.length === 0 && "Tags is required"}
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-700 my-5">
                Reporting by :{" "}
              </h2>
              {userData && (
                <div className="flex gap-3">
                  <Image
                    src={userData.image}
                    alt="reporter-image"
                    height={100}
                    width={100}
                    className="h-14 w-14 rounded-full border"
                  ></Image>
                  <div>
                    <p className="text-lg font-bold capitalize text-gray-700">
                      {userData.name}
                    </p>
                    <p className="text-gray-700">{userData.role}</p>
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-fit bg-blue-500 px-10 py-2 text-lg text-white font-semibold my-5 cursor-pointer rounded"
              disabled={
                isUploading ||
                !formData.news.image ||
                !formData.news.category ||
                !formData.news.header ||
                !formData.news.body ||
                formData.news.tags.length === 0
              }
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
