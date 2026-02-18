require("dotenv").config();

const requiredEnv = ["JWT_USER_PASSWORD", "JWT_ADMIN_PASSWORD", "MONGODB_URI"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} is missing in environment variables`);
  }
});

const config = {
  port: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_ADMIN_PASSWORD: process.env.JWT_ADMIN_PASSWORD,
  JWT_USER_PASSWORD: process.env.JWT_USER_PASSWORD,
};

module.exports = config;
