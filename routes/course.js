const { Router } = require("express");
const { courseModel, purchaseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");

const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.body;

    // should check that the user has actually paid theh price
    await purchaseModel.create({
      userId,
      courseId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
  res.json({ message: "You have successfully bought the course" });
});

courseRouter.get("/preview", async (req, res) => {
  const courses = await courseModel.find({});
  res.json({ courses });

  res.json({ message: "Courses preview end point" });
});

module.exports = {
  courseRouter: courseRouter,
};
