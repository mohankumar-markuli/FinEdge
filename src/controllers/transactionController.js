const mongoose = require("mongoose");
const Transaction = require("../models/transactionModel");

const { validateEditTransactionData } = require("../middleware/validator");
const { transactionFilter } = require("../services/transactionService");

const addTransaction = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            type,
            category,
            amount,
            merchant,
            description,
            transactionDate,
            paymentMethod
        } = req.body;

        if (!type || !category || !amount) {
            return res.status(400).json({
                message: "type, category and amount are required"
            });
        }

        const transaction = new Transaction({
            userId,
            type,
            category,
            amount,
            merchant,
            description,
            paymentMethod,
            transactionDate
        });

        const data = await transaction.save();

        res.status(201).json({
            message: `${req.user.firstName} added transaction - ${category} : ${amount} ${req.user.currency}`,
            data: data
        });
    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR:", err.message,
        );

        res.status(400).json({
            message: `Failed to send request`,
            error: "BAD_REQUEST",
        });
    }
};

const getTransactions = async (req, res) => {
    try {
        const filter = transactionFilter(req);

        const transactions = await Transaction.find(filter)
            .sort({ transactionDate: -1 });

        res.status(200).json({
            message: "Transactions fetched successfully",
            count: transactions.length,
            data: transactions,
        });

    } catch (err) {
        console.error(new Date().toISOString(), "ERROR:", err.message,);

        res.status(400).json({
            message: `Failed to send request`,
            error: "BAD_REQUEST",
        });
    }
};

const getRecentTransactions = async (req, res) => {
    try {
        const userId = req.user._id;

        const limit = Number(req.query.limit) || 5;

        const transactions = await Transaction.find({ userId })
            .sort({ transactionDate: -1 })
            .limit(limit)
            .select("category amount transactionDate");

        res.status(200).json({
            message: "Recent transactions fetched successfully",
            count: transactions.length,
            data: transactions,
        });

    } catch (err) {
        console.error(new Date().toISOString(), "ERROR:", err.message);

        res.status(500).json({
            message: "Failed to fetch recent transactions",
            error: err.message,
        });
    }
};

const getTransactionById = async (req, res) => {
    try {
        const userId = req.user._id;
        const transactionId = req.params.transactionId;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({
                message: "Invalid transaction ID",
            });
        }

        const transaction = await Transaction.findOne({
            userId,
            _id: transactionId
        });

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found",
            });
        }

        res.status(200).json({
            message: "Transaction fetched successfully",
            data: transaction,
        });

    } catch (err) {
        console.error(new Date().toISOString(), "ERROR:", err.message,);

        res.status(400).json({
            message: `Failed to send request`,
            error: "BAD_REQUEST",
        });
    }
};

const updateTransactionById = async (req, res) => {
    try {
        await validateEditTransactionData(req);

        const userId = req.user._id;
        const transactionId = req.params.transactionId;

        if (!mongoose.Types.ObjectId.isValid(transactionId))
            throw new Error("Invalid transaction ID");

        if (req.body.transactionDate) {
            const date = new Date(req.body.transactionDate);
            if (!date.getTime()) throw new Error("Invalid transaction date");
            req.body.transactionDate = date;
        }

        const updateTransaction = await Transaction.findOne({
            userId,
            _id: transactionId
        });

        Object.keys(req.body).forEach((key) => {
            updateTransaction[key] = req.body[key];
        });
        await updateTransaction.save();

        res.status(200).json({
            message: `Transaction Updated Successfully`,
            data: updateTransaction
        });
    }
    catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR:", err
        );

        res.status(400).json({
            message: `Failed to update transaction`,
            error: "BAD_REQUEST",
        });
    }
}

const deleteTransactionById = async (req, res) => {
    try {
        const userId = req.user._id;
        const transactionId = req.params.transactionId;

        if (!mongoose.Types.ObjectId.isValid(transactionId))
            throw new Error("Invalid transaction ID");

        const deletedTransaction = await Transaction.findOneAndDelete({
            _id: transactionId,
            userId,
        });

        if (!deletedTransaction) throw new Error("Transaction not found");

        res.status(200).json({
            message: "Transaction deleted successfully",
            data: deletedTransaction,
        });

    }
    catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR:", err.message
        );

        res.status(400).json({
            message: `Failed to delete transaction`,
            error: "BAD_REQUEST",
        });
    }

}

module.exports = {
    addTransaction,
    getTransactions,
    getRecentTransactions,
    getTransactionById,
    updateTransactionById,
    deleteTransactionById
};