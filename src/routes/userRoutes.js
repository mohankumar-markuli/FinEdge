const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/userAuth");
const { viewUser, editUser, changePassword } = require("../controllers/userController");

userRouter.get('/view', userAuth, viewUser);
userRouter.patch('/edit', userAuth, editUser);
userRouter.patch('/changepassword', userAuth, changePassword);

module.exports = userRouter;