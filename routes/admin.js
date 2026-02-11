const { Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../db");
const { z, number, safeParse } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;
// Zod Schema for admin
const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .max(20)
    .refine(
      (val) => {
        const isLetter = (c) => c.toLowerCase() !== c.toUpperCase();
        const isDigit = (c) => c >= "0" && c <= "9";
        const isSpecial = (c) => !isLetter(c) && !isDigit(c);

        let letters = 0;
        let numbers = 0;
        let specials = 0;

        for (const char of val) {
          if (isLetter(char)) letters++;
          else if (isDigit(char)) numbers++;
          else specials++;
        }
        return letters >= 1 && numbers >= 1 && specials >= 1;
      },
      {
        message:
          "Password must contain at least one letter, one number, atleast one special character",
      },
    ),
  firstName: z.string().refine((val) => val.split(" ").length === 1, {
    message: "First name must be single word",
  }),
  lastName: z.string().min(1),
});

const signinSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(1, { message: "Password is required" }),
});

adminRouter.post("/signup", async (req, res) => {
  try {
    const parsedData = signupSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsedData.error.errors,
      });
    }

    const { email, password, firstName, lastName } = parsedData.data;

    // check if user already registered
    const existingUser = await adminModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // hash password
    const hashMyPassword = await bcrypt.hash(password, 10);
    const admin = await adminModel.create({
      email: email,
      password: hashMyPassword,
      firstName: firstName,
      lastName: lastName,
    });

    return res.status(201).json({
      message: "User created successfully",
      userId: admin._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

adminRouter.post("/signin", async (req, res) => {
  try {
    const parsedData = signinSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ errors: parsedData.error.errors });
    }

    const { email, password } = parsedData.data;

    const admin = await adminModel.findOne({ email: email });
    if (!admin) {
      return res.status(401).json({
        message: "Incorrect Credentials",
      });
    }

    // compare the password
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect credentials" });
    }

    if (!JWT_ADMIN_PASSWORD) {
      throw new Error(
        "JWT_ADMIN_PASSWORD is not defined in environment variables",
      );
    }

    const token = jwt.sign(
      {
        id: admin._id,
      },
      JWT_ADMIN_PASSWORD,
      { expiresIn: "7d" },
    );

    res.json({ token: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

adminRouter.post("/course", (req, res) => {
  res.json({ message: "course creation endpoint" });
});

adminRouter.put("/course", (req, res) => {
  res.json({ message: "course endpoint" });
});

adminRouter.get("/course/bulk", (req, res) => {
  res.json({ message: "course endpoint" });
});

module.exports = { adminRouter };
