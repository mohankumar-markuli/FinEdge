const express = require("express");
const transactionRouter = express.Router();

const { userAuth } = require("../middleware/userAuth");

const { addTransaction,
    getTransactions,
    getTransactionById,
    updateTransactionById,
    deleteTransactionById } = require("../controllers/transactionController");

transactionRouter.use(userAuth);

transactionRouter.post("/", addTransaction);
transactionRouter.get("/", getTransactions);
transactionRouter.get("/:transactionId", getTransactionById);
transactionRouter.patch("/:transactionId", updateTransactionById);
transactionRouter.delete("/:transactionId", deleteTransactionById);

module.exports = transactionRouter;