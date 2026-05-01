const mongoose = require("mongoose");
const Transaction = require("../models/transactionModel");

const { validateTransactionFields, validateEditTransactionData } = require("../middlewares/validator");
const { transactionFilter } = require("../services/transactionService");

const addTransaction = async (req, res, next) => {
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

        await validateTransactionFields(req);

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

        const tansactionResponse = {
            _id: data._id,
            type: data.type,
            category: data.category,
            amount: data.amount,
            paymentMethod: data.paymentMethod,
            transactionDate: data.transactionDate,
            merchant: data.merchant,
            description: data.description,
        }

        res.status(201).json({
            message: `${req.user.firstName} added transaction - ${category} : ${amount} ${req.user.currency}`,
            data: tansactionResponse
        });
    } catch (err) {
        next(err);
    }
};

const getTransactions = async (req, res, next) => {
    try {
        const filter = transactionFilter(req);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const transactions = await Transaction.find(filter)
            .sort({ transactionDate: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select("_id type category amount paymentMethod transactionDate merchant description");

        res.status(200).json({
            message: "Transactions fetched successfully",
            count: transactions.length,
            data: transactions,
        });

    } catch (err) {
        next(err)
    }
};

const getRecentTransactions = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const transactions = await Transaction.find({ userId })
            .sort({ transactionDate: -1 })
            .limit(limit)
            .skip((page - 1) * limit)
            .select("category amount transactionDate");

        res.status(200).json({
            message: "Recent transactions fetched successfully",
            count: transactions.length,
            data: transactions,
        });

    } catch (err) {
        next(err);
    }
};

const getTransactionById = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const transactionId = req.params.transactionId;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) throw new Error("Invalid transaction ID");

        const transaction = await Transaction.findOne({
            userId,
            _id: transactionId
        }).select("_id type category amount paymentMethod transactionDate merchant description");

        if (!transaction) throw new Error("Transaction not found");

        res.status(200).json({
            message: "Transaction fetched successfully",
            data: transaction,
        });

    } catch (err) {
        next(err);
    }
};

const updateTransactionById = async (req, res, next) => {
    try {
        await validateEditTransactionData(req);

        const userId = req.user._id;
        const transactionId = req.params.transactionId;

        if (!mongoose.Types.ObjectId.isValid(transactionId))
            throw new Error("Invalid transaction ID");

        const updateTransaction = await Transaction.findOne({
            userId,
            _id: transactionId
        });

        Object.keys(req.body).forEach((key) => {
            updateTransaction[key] = req.body[key];
        });

        await updateTransaction.save();

        const updatedTansactionResponse = {
            _id: updateTransaction._id,
            type: updateTransaction.type,
            category: updateTransaction.category,
            amount: updateTransaction.amount,
            paymentMethod: updateTransaction.paymentMethod,
            transactionDate: updateTransaction.transactionDate,
            merchant: updateTransaction.merchant,
            description: updateTransaction.description,
        }

        res.status(200).json({
            message: `Transaction Updated Successfully`,
            data: updatedTansactionResponse
        });
    }
    catch (err) {
        next(err);
    }
}

const deleteTransactionById = async (req, res, next) => {
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

        const deleteTansactionResponse = {
            _id: deletedTransaction._id,
            type: deletedTransaction.type,
            category: deletedTransaction.category,
            amount: deletedTransaction.amount,
        }

        res.status(200).json({
            message: "Transaction deleted successfully",
            data: deleteTansactionResponse,
        });

    }
    catch (err) {
        next(err);
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