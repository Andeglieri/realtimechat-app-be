import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../config/db";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
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

      const token = generateToken({id: user.id});
      res.json({sucess: true, message: "User registered successfully.", data: { id: user.id, token }});
  } catch (err) {
    res.status(400).json({ error: "Error creating user.", message: err });
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if(!email || !password){
      return res.status(400).json({message: "Some required fields are missing." });
    }

    const user = await prisma.user.findUnique({ where: {email: email} });

    if(!user) return res.status(404).json({message: "User not found." });

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).json({message: "Invalid password." });
    }

    const token = generateToken({id: user.id});

    res.status(200).json({ message: "Authenticated successfully.", token });
  } catch(err){
    res.status(400).json({ error: "Authentication failed.", message: err });
  }

}