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
