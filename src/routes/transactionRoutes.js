const express = require("express");
const transactionRouter = express.Router();

const { userAuth } = require("../middleware/userAuth");

const { addTransaction,
    getTransactions,
    getTransactionById,
    updateTransactionById } = require("../controllers/transactionController");

transactionRouter.post("/", userAuth, addTransaction);
transactionRouter.get("/", userAuth, getTransactions);
transactionRouter.get("/:transactionId", userAuth, getTransactionById);
transactionRouter.patch("/:transactionId", userAuth, updateTransactionById);

module.exports = transactionRouter;