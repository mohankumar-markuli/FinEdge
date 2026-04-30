const express = require("express");
const transactionRouter = express.Router();

const { userAuth } = require("../middleware/userAuth");

const { addTransaction,
    getTransactions,
    getTransactionById,
    updateTransactionById,
    deleteTransactionById } = require("../controllers/transactionController");

transactionRouter.post("/", userAuth, addTransaction);
transactionRouter.get("/", userAuth, getTransactions);
transactionRouter.get("/:transactionId", userAuth, getTransactionById);
transactionRouter.patch("/:transactionId", userAuth, updateTransactionById);
transactionRouter.delete("/:transactionId", userAuth, deleteTransactionById);

module.exports = transactionRouter;