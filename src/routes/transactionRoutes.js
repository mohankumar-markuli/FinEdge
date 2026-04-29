const express = require("express");
const transactionRouter = express.Router();

const { userAuth } = require("../middleware/userAuth");
const { addTransaction } = require("../controllers/transactionController");

transactionRouter.post("/", userAuth, addTransaction);

module.exports = transactionRouter;