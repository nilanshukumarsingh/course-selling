const express = require("express");
const Router = express.Router;

// const { Router } = require("express");

const userRouter = Router();

userRouter.post("/signup", (req, res) => {
  res.send("Signup endpoint");
});

userRouter.post("/signin", (req, res) => {
  res.send("Signin endpoint");
});

userRouter.get("/purchases", (req, res) => {
  res.json({ message: "Purchases endpoint" });
});

module.exports = {
  userRouter: userRouter,
};
