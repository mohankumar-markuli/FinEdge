const express = require("express");
const userRouter = express.Router();

const { viewUser } = require("../controllers/userController");

userRouter.get('/view', viewUser);

module.exports = userRouter;