const { Router } = require("express");

const courseRouter = Router();

courseRouter.post("/purchases", (req, res) => {
  res.json({ message: "Purchase endpoint" });
});

courseRouter.get("/preview", (req, res) => {
  res.json({ message: "Courses preview end point" });
});

module.exports = {
  courseRouter: courseRouter,
};
