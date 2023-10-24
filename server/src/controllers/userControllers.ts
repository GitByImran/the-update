import { Request, Response } from "express";
import UserModel from "../models/userModel";

export const sendUsers = async (req: Request, res: Response) => {
  try {
    const { name, email, image, role, totalReport } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const newUser = new UserModel({
      name,
      email,
      image,
      role,
      totalReport,
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error sending user document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.userId; // Use req.params.userId
  const { name, email, image, role, totalReport } = req.body;

  try {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          name,
          email,
          image,
          role,
          totalReport,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
