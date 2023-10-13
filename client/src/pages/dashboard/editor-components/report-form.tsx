import React, { useState } from "react";
import axios from "axios";

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
    position: string;
  };
}

const ReportForm: React.FC<ReportFormProps> = () => {
  const [formData, setFormData] = useState<FormData>({
    news: {
      image: "",
      category: "",
      header: "",
      body: "",
      tags: [],
    },
    reporter: {
      image: "",
      name: "",
      position: "",
    },
  });

  const [isUploading, setIsUploading] = useState(false);

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

  const handleReporterPositionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const position = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      reporter: {
        ...prevData.reporter,
        position,
      },
    }));
  };

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
      const response = await axios.post(
        "http://localhost:8080/api/reports",
        formData
      );
      console.log("Report submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <div className="w-10/12 mx-auto">
      <h2>Report Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <label className="text-lg">News Image :</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {isUploading && <p className="block ml-2">Uploading...</p>}
          </div>
          <div className="flex flex-col gap-2 w-fit">
            <label className="text-lg">Category:</label>
            <select
              name="category"
              value={formData.news.category}
              onChange={handleCategoryChange}
              className="px-5 py-2 border"
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
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Header:</label>
            <input
              type="text"
              name="header"
              value={formData.news.header}
              onChange={handleInputChange}
              className="border-2 rounded-md p-2 outline-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Body:</label>
            <textarea
              name="body"
              value={formData.news.body}
              onChange={handleInputChange}
              className="border-2 rounded-md p-2 outline-blue-500"
            />
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
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Reporter Image:</label>
            <input
              type="text"
              name="image"
              value={formData.reporter.image}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reporter: { ...formData.reporter, image: e.target.value },
                })
              }
              className="border-2 rounded-md p-2 outline-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Reporter Name:</label>
            <input
              type="text"
              name="name"
              value={formData.reporter.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reporter: { ...formData.reporter, name: e.target.value },
                })
              }
              className="border-2 rounded-md p-2 outline-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2 w-fit">
            <label className="text-lg">Reporter Position:</label>
            <select
              name="position"
              value={formData.reporter.position}
              onChange={handleReporterPositionChange}
              className="px-5 py-2 border"
            >
              <option value="">Select Position</option>
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
              <option value="Editor">Editor</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-fit bg-blue-500 px-10 py-2 text-lg text-white font-semibold my-5"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
