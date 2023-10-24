import { Request, Response } from "express";
import ReportModel from "../models/reportModel";

interface Comment {
  _id: string;
  user: {
    email: string;
  };
  comment: string;
  createdAt: Date;
}

export const sendComment = async (req: Request, res: Response) => {
  const reportId = req.params.id;
  const { comment, user } = req.body;

  try {
    const updatedReport = await ReportModel.findByIdAndUpdate(
      reportId,
      {
        $push: {
          comments: {
            user: user,
            comment: comment,
          },
        },
      },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getComment = async (req: Request, res: Response) => {
  const reportId = req.params.id;

  try {
    const report = await ReportModel.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ comments: report.comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editComment = async (req: Request, res: Response) => {
  const reportId = req.params.reportId;
  const commentId = req.params.commentId;
  const { updatedComment } = req.body;

  try {
    const report = await ReportModel.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const comment: Comment | undefined = report.comments.find(
      (comment: Comment) => comment._id == commentId
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.comment = updatedComment;
    await report.save();

    res
      .status(200)
      .json({ message: "Comment updated successfully", updatedComment });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const reportId = req.params.reportId;
  const commentId = req.params.commentId;

  try {
    const updatedReport = await ReportModel.findByIdAndUpdate(
      reportId,
      {
        $pull: {
          comments: { _id: commentId },
        },
      },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
