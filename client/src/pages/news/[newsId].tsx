import { MdCancel } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import { BiArrowBack, BiRightArrowAlt } from "react-icons/bi";
import { BsFillClockFill } from "react-icons/bs";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { useNewsContext } from "../news-provider/news-provider";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { UseAuthContext } from "../auth-provider/auth-provider";
import axios from "axios";
import Image from "next/image";
import Swal from "sweetalert2";

// Define Comment and MatchedUserData types for type checking
interface Comment {
  _id: string;
  comment: string;
  user: { email: string } | null;
}

interface MatchedUserData {
  image: string;
  name: string;
  email: string;
  _id: string;
}

const NewsDetail: React.FC = () => {
  const router = useRouter();
  const { newsId } = router.query;
  const { data: newsData, refetch } = useNewsContext();
  const { user, userList } = UseAuthContext();
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [existingComments, setExistingComments] = useState<Comment[]>([]);
  const [matchedUserData, setMatchedUserData] = useState<MatchedUserData[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editedComment, setEditedComment] = useState("");
  const [commentToEdit, setCommentToEdit] = useState<string | null>(null);

  const filteredNews = useMemo(() => {
    if (!newsData || !newsId) {
      return [];
    }

    const selectedCategory = newsData.find(
      (item) => String(item._id) === String(newsId)
    )?.news.category;

    if (!selectedCategory) {
      return [];
    }

    // Calculate filtered news based on selected category
    const filteredNews = newsData
      .filter((item) => {
        const currentNewsId = Array.isArray(newsId) ? newsId[0] : newsId;

        return (
          item.news.category === selectedCategory &&
          String(item._id) !== String(currentNewsId)
        );
      })

      .sort(
        (a, b) =>
          new Date(b.reportTime).getTime() - new Date(a.reportTime).getTime()
      );

    return filteredNews;
  }, [newsData, newsId]);

  // If no news data or selected item, display loading message
  if (!newsData || !newsId) {
    return <p>Loading...</p>;
  }

  const selectedItem = newsData.find(
    (item) => String(item._id) === String(newsId)
  );

  // Fetch existing comments when the selected item changes
  const fetchExistingComments = async (reportId: any) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/reports/${reportId}/comments`
      );
      return response.data.comments;
    } catch (error) {
      console.error("Error fetching existing comments:", error);
      return [];
    }
  };

  useEffect(() => {
    if (selectedItem) {
      fetchExistingComments(selectedItem._id).then((comments) => {
        setExistingComments(comments);
      });
    }
  }, [selectedItem]);

  // Fetch existing comments and update the selected item changes
  const fetchAndUpdateComments = async () => {
    if (selectedItem) {
      const comments = await fetchExistingComments(selectedItem._id);
      setExistingComments(comments);
    }
  };

  // Function to match user emails
  const matchUserEmailsAndLog = (existingComments: Comment[]) => {
    const matchedUserData: MatchedUserData[] = [];

    existingComments.forEach((comment) => {
      const userEmail = comment.user?.email;
      if (userEmail) {
        const matchedUser = userList?.find((user) => user.email === userEmail);
        if (matchedUser) {
          const getCommentor: MatchedUserData = {
            _id: matchedUser._id,
            image: matchedUser.image,
            name: matchedUser.name,
            email: matchedUser.email,
          };
          matchedUserData.push(getCommentor);
        }
      }
    });

    // Set matched user data in state
    setMatchedUserData(matchedUserData);
  };

  // Match user emails and log data when existing comments or user list change
  useEffect(() => {
    matchUserEmailsAndLog(existingComments);
  }, [existingComments, userList]);

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      Swal.fire({
        icon: "error",
        title: "Soory...!",
        text: "You have to write something to comment!",
      });
      return;
    }
    const reportId = selectedItem?._id;

    try {
      const response = await axios.post(
        `http://localhost:8080/api/reports/${reportId}/comments`,
        {
          user: user,
          comment: comment,
        }
      );

      const updatedNewsItem = response.data;
      setComments(updatedNewsItem.comments);

      // Add the new comment to existing comments
      setExistingComments((prevComments) => [
        { user: user, comment: comment, _id: comment },
        ...prevComments,
      ]);

      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Handle comment discard
  const handleCommentDiscard = () => {
    setComment("");
  };

  // Delete a comment
  const deleteComment = async (commentId: string) => {
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
          `http://localhost:8080/api/reports/${selectedItem?._id}/comments/${commentId}`
        );
        console.log(response);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        fetchAndUpdateComments();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Edit a comment
  const editComment = (commentId: string) => {
    const existingComment = existingComments.find(
      (comment) => comment._id === commentId
    );
    if (existingComment) {
      setCommentToEdit(commentId);
      setEditMode(true);
      setEditedComment(existingComment.comment);
    }
  };

  // Cancel editing a comment
  const cancelEdit = () => {
    setCommentToEdit(null);
    setEditMode(false);
    setEditedComment("");
  };

  // Update a comment
  const updateComment = async (commentId: string) => {
    if (!editedComment.trim()) {
      Swal.fire({
        icon: "error",
        title: "Sorry...!",
        text: "You have to write something to update the comment!",
      });
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:8080/api/reports/${selectedItem?._id}/comments/${commentId}`,
        { updatedComment: editedComment }
      );

      const updated = response.data.updatedComment;

      setExistingComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? { ...comment, comment: updated } : comment
        )
      );

      setCommentToEdit(null);
      setEditMode(false);
      setEditedComment("");
      Swal.fire("Updated!", "Your comment has been updated.", "success");
    } catch (error) {
      console.error("Error updating comment:", error);
      Swal.fire("Error", "Failed to update the comment.", "error");
    }
  };

  // If no selected item, display loading message
  if (!selectedItem) {
    return <p>Loading...</p>;
  }

  // Function to navigate back
  const goBack = () => {
    router.back();
  };

  return (
    <div className="w-10/12 mx-auto my-20">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8 border p-5">
          <div className="flex items-center justify-between">
            <div className="reporter-info flex items-center gap-3">
              {/* <div className="h-16 w-16 bg-gray-300 overflow-hidden rounded-full">
                <Image
                  src={selectedItem.reporter.image}
                  alt=""
                  height={100}
                  width={100}
                  className="h-full w-full object-cover object-top"
                />
              </div> */}
              <div className="">
                <h2 className="text-2xl font-semibold text-blue-500">
                  {selectedItem.reporter.name}
                </h2>
                <h2 className="text-gray-500">
                  {selectedItem.reporter.position}
                </h2>
              </div>
            </div>
            <div className="reported-time flex flex-col">
              <p className="text-md text-gray-500 flex items-center gap-1">
                <BsFillClockFill /> {selectedItem.reportTime.split(",")[1]}
              </p>
              <p className="text-md text-gray-500 flex items-center gap-1">
                <BsFillCalendarCheckFill />{" "}
                {selectedItem.reportTime.split(",")[0]}
              </p>
            </div>
          </div>
          <div className="detailed-news mt-10 flex flex-col gap-5">
            <h2 className="text-2xl font-semibold">
              {selectedItem.news.header}
            </h2>
            <p className="text-lg break-words">{selectedItem.news.body}</p>
          </div>
          <div className="tags flex flex-wrap gap-2 mt-10">
            {selectedItem.news.tags.map((tag, index) => (
              <span key={index} className="px-2 text-gray-500 font-semibold ">
                # {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 border p-5">
          <h2>Most recent</h2>
          <div className="latest-published-news mt-5 flex flex-col lg:flex-col sm:flex-row gap-5 ">
            {filteredNews.slice(0, 3).map((item, index) => (
              <Link
                className="basis-full border p-2 relative hover-bg-gray-100"
                href={`/news/${item._id}`}
                key={index}
                passHref
              >
                <h2 className="font-semibold text-blue-500 mb-10">
                  {item.news.header}
                </h2>
                <p className="text-gray-500 font-semibold flex items-center gap-2 absolute bottom-2 left-2">
                  Read it
                  <BiRightArrowAlt />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={goBack}
        className="bg-blue-500 text-white px-5 py-2 my-10 hover-bg-blue-500 rounded flex items-center w-fit"
      >
        <BiArrowBack className="mr-2" />
        Go Back
      </button>
      <div className="flex flex-col items-start gap-5">
        <textarea
          placeholder="Write your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border py-2 px-5 h-20 w-96"
        />
        <div className="flex gap-2">
          <button
            title="send"
            onClick={handleCommentSubmit}
            className="border h-10 w-10 text-2xl flex items-center justify-center rounded-md text-blue-500"
          >
            <RiSendPlaneFill />
          </button>
          <button
            title="clear and discard"
            className="border h-10 w-10 text-2xl flex items-center justify-center rounded-md text-blue-500"
            onClick={handleCommentDiscard}
          >
            <AiOutlineClear />
          </button>
        </div>
      </div>

      {/* Display existing comments */}
      <div className="mt-10">
        <h2 className="font-semibold text-gray-700">Comments in this news :</h2>
        <ul className="mt-5 flex flex-col gap-5">
          {existingComments.length < 1
            ? "No comment yet"
            : existingComments.map((comment, index) => (
                <li key={index}>
                  {matchedUserData[index] && (
                    <div className="flex gap-5">
                      <Image
                        src={matchedUserData[index].image}
                        alt=""
                        height={50}
                        width={50}
                        className="rounded-lg h-12 w-12"
                      />
                      <div>
                        <div className="min-h-max w-96 border px-5 py-1 rounded-lg">
                          <p>
                            <span className="capitalize">
                              {matchedUserData[index].name}
                            </span>
                            ({matchedUserData[index].email})
                          </p>
                          {comment._id === commentToEdit ? (
                            <div className="my-5">
                              <textarea
                                value={editedComment}
                                onChange={(e) =>
                                  setEditedComment(e.target.value)
                                }
                                className="border py-2 px-5 h-20 w-full"
                              />
                              <div className="flex gap-2">
                                <button
                                  className="border h-10 w-10 text-2xl flex items-center justify-center rounded-md text-blue-500"
                                  onClick={() => updateComment(comment._id)}
                                >
                                  <RiSendPlaneFill />
                                </button>
                                <button
                                  className="border h-10 w-10 text-2xl flex items-center justify-center rounded-md text-blue-500"
                                  onClick={cancelEdit}
                                >
                                  <MdCancel />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p>{comment.comment}</p>
                          )}
                        </div>
                        <div className="flex gap-2 px-5">
                          <button
                            className="text-gray-500"
                            onClick={() => deleteComment(comment._id)}
                          >
                            delete
                          </button>
                          <button
                            className="text-gray-500"
                            onClick={() => editComment(comment._id)}
                          >
                            edit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
        </ul>
      </div>
      {/*  */}
    </div>
  );
};

export default NewsDetail;
