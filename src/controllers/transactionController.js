const mongoose = require("mongoose");
const Transaction = require("../models/transactionModel");

const { createTransactionService,
    getTransactionsService,
    getRecentTransactionsService,
    getTransactionByIdService,
    updateTransactionService,
    deleteTransactionService,
    transactionFilter } = require("../services/transactionServices");

const addTransaction = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const data = await createTransactionService(userId, req.body);

        res.status(201).json({
            success: true,
            message: `${req.user.firstName} added transaction - ${data.category} : ${data.amount} ${req.user.currency}`,
            data
        });

    } catch (err) {
        next(err);
    }
};

const getTransactions = async (req, res, next) => {
    try {
        const filter = transactionFilter(req);

        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

        const { transactions, total } = await getTransactionsService(filter, page, limit);

        res.status(200).json({
            message: "Transactions fetched successfully",
            data: transactions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (err) {
        next(err);
    }
};

const getRecentTransactions = async (req, res, next) => {
    try {
        const limit = Math.min(10, Math.max(1, Number(req.query.limit) || 5));

        const transactions = await getRecentTransactionsService(req.user._id, limit);

        res.status(200).json({
            message: "Recent transactions fetched successfully",
            data: transactions,
        });

    } catch (err) {
        next(err);
    }
};

const getTransaction = async (req, res, next) => {
    try {
        const transaction = await getTransactionByIdService(
            req.user._id,
            req.params.transactionId
        );

        res.status(200).json({
            message: "Transaction fetched successfully",
            data: transaction,
        });

    } catch (err) {
        next(err);
    }
};

const updateTransaction = async (req, res, next) => {
    try {
        const data = await updateTransactionService(
            req.user._id,
            req.params.transactionId,
            req.body
        );

        res.status(200).json({
            message: "Transaction Updated Successfully",
            data
        });

    } catch (err) {
        next(err);
    }
};

const deleteTransaction = async (req, res, next) => {
    try {
        const data = await deleteTransactionService(
            req.user._id,
            req.params.transactionId
        );

        res.status(200).json({
            message: "Transaction deleted successfully",
            data
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    addTransaction,
    getTransactions,
    getRecentTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction
};