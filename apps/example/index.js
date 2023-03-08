const serverless = require("serverless-http");
const express = require("express");
const app = express();

app.get("/api1", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root example1!!",
  });
});

app.get("/api1/path", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path example1!",
  });
});

module.exports.handler = serverless(app);
