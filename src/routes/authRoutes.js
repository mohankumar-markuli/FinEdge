const express = require("express");
const authRouter = express.Router();

const { userSignUp, userLogin } = require("../controllers/authController");

authRouter.post('/signup', userSignUp);
authRouter.post('/login', userLogin);

module.exports = authRouter;