const express = require("express");
const Router = express.router;

// const {Router} = require('express')
const courseRouter = Router();

courseRouter.get("/course/purchases", (req, res) => {
  res.json({ message: "Purchase endpoint" });
});

courseRouter.get("/courses", (req, res) => {
  res.json({ message: "Courses end point" });
});

module.exports = {
  courseRouter: courseRouter,
};
