const connectDB = require("../src/shared/config/db");
const app = require("../src/app");

let isDbConnected = false;

module.exports = async (req, res) => {
  if (!isDbConnected) {
    await connectDB();
    isDbConnected = true;
  }

  return app(req, res);
};