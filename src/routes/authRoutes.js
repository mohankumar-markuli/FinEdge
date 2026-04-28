const express = require("express");
const authRouter = express.Router();

const { userSignUp } = require("../controllers/authController");

authRouter.post('/signup', userSignUp);

module.exports = authRouter;