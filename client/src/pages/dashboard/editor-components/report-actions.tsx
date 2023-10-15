import { TbListDetails } from "react-icons/tb";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { useNewsContext } from "@/pages/news-provider/news-provider";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import EditModal from "./report-edit";

interface EditModalProps {
  onClose: () => void;
  onSave: (editedFields: { header: string; body: string }) => void;
  editedItem: any;
}

const ReportActions: React.FC = () => {
  const { data: newsData, refetch } = useNewsContext();

  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editedItem, setEditedItem] = useState<any | null>(null);

  const handleEdit = (item: any) => {
    setEditedItem(item);
    setEditModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/reports/${id}`
      );
      console.log(response);

      refetch();
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  const handleSave = async (editedFields: {
    header: string;
    body: string;
    image: string;
    category: string;
    tags: string[];
  }) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/reports/${editedItem?._id}`,
        {
          news: {
            header: editedFields.header,
            body: editedFields.body,
            image: editedFields.image,
            category: editedFields.category,
            tags: editedFields.tags,
          },
        }
      );

      console.log("PATCH Response:", response.data);
      refetch();
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  return (
    <div className="w-12/12 mx-auto relative">
      <h2>report actions </h2>
      <div className="grid grid-cols-12 gap-5">
        {newsData.map((item, index) => (
          <div key={index} className="col-span-4 p-5 border">
            <div className="flex flex-col gap-2">
              <h2 className="truncate text-xl font-semibold">
                {item.news.header}
              </h2>

              <p className="truncate text-gray-500">{item.news.body}</p>
              <span className="">October 13th 2023, 12:24:36 am</span>
              <div className="actions flex justify-between mt-5">
                <div>
                  <button className="text-xl font-bold pointer-events-none">
                    <IoSettingsOutline />
                  </button>
                </div>
                <div className="flex gap-5">
                  <button className="text-xl font-bold" title="view details">
                    <Link
                      as={`/dashboard/editor-components/${item._id}`}
                      href="/dashboard/editor-components/[reportId]"
                    >
                      <TbListDetails />
                    </Link>
                  </button>
                  <button
                    className="text-xl font-bold"
                    title="edit"
                    onClick={() => handleEdit(item)}
                  >
                    <AiOutlineEdit />
                    {/**edit button */}
                  </button>
                  <button
                    className="text-xl font-bold"
                    title="delete"
                    onClick={() => handleDelete(item._id.toString())}
                  >
                    <AiOutlineDelete /> {/** delete button */}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editModalVisible && (
        <div
          className="absolute top-0 left-0 h-screen w-full flex justify-center items-center"
          style={{
            background: editModalVisible ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0)",
          }}
        >
          <EditModal
            onClose={() => {
              setEditModalVisible(false);
              setEditedItem(null);
            }}
            onSave={handleSave}
            editedItem={editedItem}
          />
        </div>
      )}
    </div>
  );
};

export default ReportActions;
