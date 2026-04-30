const express = require("express");
const authRouter = express.Router();

const { userSignUp, userLogin, userlogout } = require("../controllers/authController");
const { userAuth } = require("../middlewares/userAuth");

authRouter.post('/signup', userSignUp);
authRouter.post('/login', userLogin);
authRouter.post('/logout', userAuth, userlogout);

module.exports = authRouter;