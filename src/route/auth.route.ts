import { Router } from "express";
import { SignInSchema, SignupSchema } from "../types/type.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const route = Router();

route.post("/signup", async (req, res) => {
    const data = SignupSchema.safeParse(req.body);


    if (!data.success) {
        return res.status(400).json({
            message: "Invalid input data"
        });
    }
    try {
        const user = data.data;
        console.log("user", user)

        const userExists = await prisma.user.findFirst({
            where: { email: user.email },
        });

        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);

        const newUser = await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
            },
        });

        console.log("newUser", newUser)

        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        return res.status(500).json({ error: "User creation failed" });
    }
});


route.post("/signin", async (req, res) => {
  const data = SignInSchema.safeParse(req.body);

  if (!data.success) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const user = data.data;

    const userExists = await prisma.user.findFirst({
      where: { email: user.email },
    });

    if (!userExists) {
      return res.status(400).json({ message: "User not found!" });
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      userExists.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: userExists.id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // SET COOKIE HERE
    res.cookie("token", token, {
      httpOnly: true,       // JS cannot access
      secure: true,         // only HTTPS (set false for localhost)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default route;
