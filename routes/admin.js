const { Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../db");

adminRouter.post("/signin", (req, res) => {
  res.json({ message: "signin end point" });
});

adminRouter.post("/signup", (req, res) => {
  res.json({ message: "signup endpoint" });
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
