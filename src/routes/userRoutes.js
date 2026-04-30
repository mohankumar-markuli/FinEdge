const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/userAuth");
const { viewUser, editUser, changePassword } = require("../controllers/userController");

userRouter.use(userAuth);

userRouter.get('/view', viewUser);
userRouter.patch('/edit', editUser);
userRouter.patch('/changepassword', changePassword);

module.exports = userRouter;