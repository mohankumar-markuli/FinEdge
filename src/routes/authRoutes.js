const express = require("express");
const authRouter = express.Router();

const { userSignUp, userLogin, userlogout } = require("../controllers/authController");

authRouter.post('/signup', userSignUp);
authRouter.post('/login', userLogin);
authRouter.post('/logout', userlogout);

module.exports = authRouter;