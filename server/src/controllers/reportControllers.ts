import { Request, Response } from "express";
import ReportModel from "../models/reportModel";

export const getReports = async (req: Request, res: Response) => {
  try {
    const reports = await ReportModel.find();
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendReports = async (req: Request, res: Response) => {
  try {
    const { news, reporter } = req.body;

    const newReport = new ReportModel({
      news,
      reporter,
    });

    const savedReport = await newReport.save();

    res.status(201).json(savedReport);
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  const reportId = req.params.id;
  const { news } = req.body;

  try {
    const updatedReport = await ReportModel.findByIdAndUpdate(
      reportId,
      {
        $set: {
          news: {
            ...news,
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
    console.error("Error updating report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  const reportId = req.params.id;

  try {
    console.log("entered");
    const result = await ReportModel.findByIdAndDelete(reportId);

    if (!result) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
