import express, { Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import {
  deleteReport,
  getReports,
  sendReports,
  updateReport,
} from "./controllers/reportControllers";
import { getUsers, sendUsers, updateUser } from "./controllers/userControllers";
import {
  deleteComment,
  editComment,
  getComment,
  sendComment,
} from "./controllers/commentControllers";

// config

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// usage route

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// test route

app.get("/api", (req: Request, res: Response) => {
  res.status(200).json("server responding");
});

// report routes

app.get("/api/reports", getReports);
app.post("/api/reports", sendReports);
app.delete("/api/reports/:id", deleteReport);
app.patch("/api/reports/:id", updateReport);

// user routes

app.post("/api/users", sendUsers);
app.get("/api/users", getUsers);
app.patch("/api/users/:userId", updateUser);

// comment routes

app.post("/api/reports/:id/comments", sendComment);
app.get("/api/reports/:id/comments", getComment);
app.delete("/api/reports/:reportId/comments/:commentId", deleteComment);
app.patch("/api/reports/:reportId/comments/:commentId", editComment);

// build connection to database

mongoose
  .connect(process.env.FROM || "the-update")
  .then(() => {
    app.listen(port, () => {
      console.log(
        `database connected and check on server http://localhost:${port}/api/`
      );
    });
  })
  .catch((error) => {
    throw new Error("unable to access database, double check access secrets");
  });
