const { Router } = require("express");
const userRouter = Router();
const bcrypt = require("bcrypt");
const { userModel } = require("../db");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;

/* =========================
   Zod Signup Schema
========================= */

const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .max(20)
    .refine(
      (val) => {
        const isLetter = (c) => c.toLowerCase() !== c.toUpperCase();
        const isNumber = (c) => c >= "0" && c <= "9";
        const isSpecial = (c) => !isLetter(c) && !isNumber(c);

        let letters = 0;
        let numbers = 0;
        let specials = 0;

        for (const char of val) {
          if (isLetter(char)) letters++;
          else if (isNumber(char)) numbers++;
          else specials++;
        }
        return letters >= 1 && numbers >= 1 && specials === 1;
      },
      {
        message:
          "Password must contain at least one letter, one number, and exactly one special character",
      },
    ),
  firstName: z.string().refine((val) => val.split(" ").length === 1, {
    message: "First name must be a single word",
  }),
  lastName: z
    .string()
    .min(1)
    .refine((val) => {
      (val.split(" ").length === 2,
        { message: "Last name must contain exactly two words" });
    }),
});

const signinSchema = z.object({
  emaile: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(1, { message: "Password is required" }),
});

/* =========================
   SIGNUP
========================= */

userRouter.post("/signup", async (req, res) => {
  // const { email, password, firstName, lastName } = req.body; //TODO: adding zod validation

  // TODO: hash the password so plaintext pw is not stored in the db
  // TODO: Put inside a try catch block
  try {
    // zod validation
    const parsedData = signupSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsedData.error.errors,
      });
    }

    const { email, password, firstName, lastName } = parsedData.data;

    // check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User alredy exists" });
    }

    // hash password
    const hashMyPassword = bcrypt.hash(password, 10);
    const user = await userModel.create({
      email: email,
      password: hashMyPassword,
      firstName: firstName,
      lastName: lastName,
    });

    return res.status(201).json({
      message: "User created successfully",
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/signin", async (req, res) => {
  // const { email, password } = req.body;
  try {
    const parsedData = signinSchema.safeParse(req.body);
    if (!parsedData) {
      return res.status(409).json({ errors: parsed.error.errors });
    }

    const { email, password } = parsedData.data;
    // TODO: ideally password should be hashed and hence you cant create compare the user provided password and the database password
    const user = await userModel.findOne({
      email: email,
    }); // if we used here find() -> than it would run and searches or all collection or all documents that match the query and it return [] => which is truthy after that we should check the if(user.length === 1)
    if (!user) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_USER_PASSWORD,
      { expires: "7d" },
    );
    // do cookie or session logic here if u dont want jwt token based authentication
    res.json({ token: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

userRouter.get("/purchases", (req, res) => {
  res.json({ message: "Purchases endpoint" });
});

module.exports = { userRouter };
