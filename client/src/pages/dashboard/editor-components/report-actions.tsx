import { TbListDetails } from "react-icons/tb";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { useNewsContext } from "@/pages/news-provider/news-provider";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import EditModal from "./report-edit";
import Swal from "sweetalert2";

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
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `http://localhost:8080/api/reports/${id}`
        );
        refetch();
        Swal.fire("Deleted!", "Report has been deleted.", "success");
      }
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
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your update has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  return (
    <div className="body-content py-10 px-5">
      <div className="w-full flex justify-center">
        <h2 className="text-2xl font-semibold mb-10 border-b-4 border-blue-500 w-fit">
          Create Actions
        </h2>
      </div>
      <div className="grid grid-cols-12 gap-5">
        {newsData?.map((item, index) => (
          <div
            key={index}
            className="col-span-12 sm:col-span-6 md:col-span-4 p-5 border"
          >
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
          className="fixed top-0 left-0 h-screen w-full flex justify-center items-center "
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
