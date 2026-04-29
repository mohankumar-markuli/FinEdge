const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/userAuth");
const { viewUser } = require("../controllers/userController");

userRouter.get('/view', userAuth, viewUser);

module.exports = userRouter;