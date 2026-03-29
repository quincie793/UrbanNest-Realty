import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma }from "../lib/prisma";

const JWT_SECRET = "your_secret_key"; // later move to .env

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER"
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(401).json({ error: "Invalid password" });

   const token = jwt.sign(
  { 
    userId: user.id,
    role: user.role // 👈 ADD THIS
  },
  process.env.JWT_SECRET!,
  { expiresIn: "7d" }
);

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};