import { Request, Response } from "express";
import prisma from "../config/db";

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