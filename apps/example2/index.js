const serverless = require("serverless-http");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api2", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root example2!",
  });
});

app.get("/api2/path", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path example2!",
  });
});

app.post("/api2/post", (req, res) => {
  const body = req.body;
  return res.status(200).json({
    message: "POST RECEIVED APP2",
    data: { ...body },
  });
});

module.exports.handler = serverless(app);
