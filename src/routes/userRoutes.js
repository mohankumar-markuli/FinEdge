const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/userAuth");
const { viewUser, editUser } = require("../controllers/userController");

userRouter.get('/view', userAuth, viewUser);
userRouter.patch('/edit', userAuth, editUser);


module.exports = userRouter;