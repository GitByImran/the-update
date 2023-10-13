import { BiEditAlt } from "react-icons/bi";
import React, { useState } from "react";

interface EditModalProps {
  onClose: () => void;
  onSave: (editedFields: {
    header: string;
    body: string;
    image: string;
    category: string;
    tags: string[];
  }) => void;
  editedItem: any;
}

const EditModal: React.FC<EditModalProps> = ({
  onClose,
  onSave,
  editedItem,
}) => {
  const [editedFields, setEditedFields] = useState({
    header: editedItem.news.header,
    body: editedItem.news.body,
    image: editedItem.news.image,
    category: editedItem.news.category,
    tags: editedItem.news.tags,
  });

  const handleFieldChange = (field: string, value: any) => {
    setEditedFields((prevFields) => ({ ...prevFields, [field]: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",");

    setEditedFields((prevFields) => ({
      ...prevFields,
      tags,
    }));
  };

  const handleSave = () => {
    onSave(editedFields);
    onClose();
  };

  return (
    <div className="modal bg-white w-10/12 mx-auto p-5 rounded-xl">
      <div className="modal-content">
        <h2 className="mb-5 text-xl font-bold text-gray-500 flex items-center gap-2">
          <BiEditAlt />
          Edit Report
        </h2>
        <div className="flex flex-col gap-2">
          <label>
            <span className="text-lg">Image URL :</span>
            <br />
            <input
              type="text"
              placeholder={"previous : " + editedFields.image}
              onChange={(e) => handleFieldChange("image", e.target.value)}
              className="px-5 py-2 mt-2 border w-full rounded-md"
            />
          </label>
          <label>
            <span className="text-lg">Header :</span>
            <br />
            <input
              type="text"
              placeholder={"previous : " + editedFields.header}
              onChange={(e) => handleFieldChange("header", e.target.value)}
              className="px-5 py-2 mt-2 border w-full rounded-md"
            />
          </label>
          <label>
            <span className="text-lg">Body :</span>
            <br />
            <textarea
              placeholder={"previous : " + editedFields.body}
              onChange={(e) => handleFieldChange("body", e.target.value)}
              className="px-5 py-2 mt-2 border w-full rounded-md"
            />
          </label>
          <div className="flex flex-col gap-2 w-fit">
            <label className="text-lg">
              Category:
              <span className="ml-2 text-gray-500 text-sm">
                [ previous category - {editedFields.category} ]
              </span>
            </label>
            <select
              name="category"
              placeholder={editedFields.category}
              onChange={(e) => handleFieldChange("category", e.target.value)}
              className="px-5 py-2 border rounded-md"
            >
              <option value="">Select Category</option>
              <option value="politics">Politics</option>
              <option value="entertain">Entertain</option>
              <option value="sports">Sports</option>
              <option value="international">International</option>
              <option value="carrer">Carrer</option>
              <option value="business">Business</option>
              <option value="technology">Technology</option>
            </select>
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
              placeholder={"previous : " + editedFields.tags}
              onChange={handleTagChange}
              className="border-2 rounded-md p-2 w-full outline-blue-500"
            />
          </div>
        </div>
        <div className="modal-buttons my-5 flex gap-5">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white font-semibold text-lg border px-10 py-2 rounded-md"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white font-semibold text-lg border px-10 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
