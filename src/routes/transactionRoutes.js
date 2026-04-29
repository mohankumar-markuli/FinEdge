const express = require("express");
const transactionRouter = express.Router();

const { userAuth } = require("../middleware/userAuth");
const { addTransaction, getTransactions } = require("../controllers/transactionController");
const authRouter = require("./authRoutes");

transactionRouter.post("/", userAuth, addTransaction);
transactionRouter.get("/", userAuth, getTransactions);

module.exports = transactionRouter;