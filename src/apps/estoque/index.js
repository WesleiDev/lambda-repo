const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.get('/estoque', (req, res, next) => {
  return res.status(200).json({
    message: 'Hello from root example estoque!',
  });
});

app.get('/estoque/path', (req, res, next) => {
  return res.status(200).json({
    message: 'Hello from path example1!',
  });
});

module.exports.handler = serverless(app);
