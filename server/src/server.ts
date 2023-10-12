import express, { Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { getReports } from "./controllers/reportControllers";

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).json("server responding");
});

app.get("/api/reports", getReports);

mongoose
  .connect(process.env.FROM || "the-update")
  .then(() => {
    app.listen(port, () => {
      console.log(
        `database connected and check on server http://localhost:${port}`
      );
    });
  })
  .catch((error) => {
    throw new Error("unable to access database, double check access secrets");
  });

/* 
const ReportModel = require("./models/reportModel");

const newReport = new ReportModel({
  news: {
    image: "https://i.ibb.co/6bLGBVT/israel-palestine.jpg",
    category: "Politics",
    header: "Your news header",
    body: "Your news body",
    tags: ["tag1", "tag2"],
  },
  reporter: {
    image: "https://i.ibb.co/J3fzD2T/photo-1570612861542-284f4c12e75f.jpg",
    name: "John Doe",
    position: "editor",
  },
});

newReport
  .save()
  .then((savedReport: any) => {
    console.log("Report saved:", savedReport);
  })
  .catch((error: Error) => {
    console.error("Error saving report:", error);
  });
 */
