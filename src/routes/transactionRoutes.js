const express = require("express");
const transactionRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");

const { addTransaction,
    getTransactions,
    getRecentTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction } = require("../controllers/transactionController");

const { validateTransactionFields, validateEditTransactionData, validateObjectId } = require("../middlewares/validator");

transactionRouter.use(userAuth);

transactionRouter.post("/", validateTransactionFields, addTransaction);
transactionRouter.get("/", getTransactions);
transactionRouter.get("/recent", getRecentTransactions);
transactionRouter.get("/:transactionId", validateObjectId, getTransaction);
transactionRouter.patch("/:transactionId", validateObjectId, validateEditTransactionData, updateTransaction);
transactionRouter.delete("/:transactionId", validateObjectId, deleteTransaction);

module.exports = transactionRouter;