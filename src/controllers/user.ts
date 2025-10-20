import { Request, Response } from "express";
import prisma from "../config/db";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;

      const userExists = await prisma.user.findUnique({ where: { username } });
      
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: "User already exists.",
          error: { code: "USER_ALREADY_EXISTS" }
        });
      }

      const salt = await bcrypt.genSalt(12)
      const encryptedPassword = await bcrypt.hash(password, salt)

      const user = await prisma.user.create({
      data: { username, email, password: encryptedPassword },
      });

      res.json({sucess: true, message: "User registered successfully.", data: { id: user.id }});
  } catch (err) {
    res.status(400).json({ error: "Error creating user.", message: err });
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Failed fetching users:", error);
    res.status(500).json({ error: "Internal server error.", message: error });
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique(
      {
        where: {
          email: req.params.email
        }
      })
    res.json(user);
  } catch (error) {
    console.error("Failed fetching user:", error);
    res.status(500).json({ error: "Internal server error.", message: error });
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: req.params.id
      }
    });

    res.json({sucess: true, message: "User deleted successfully.", data: { id: user.id }});
  } catch (error) {
    console.error("Failed to delete user:", error);
    res.status(500).json({ error: "Internal server error.", message: error });
  }
}