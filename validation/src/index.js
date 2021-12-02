const express = require('express');

const userController = require('./controller/user.controller')

const app = express();
 
app.use(express.json())

app.use("/users", userController)
  module.exports = app;