const Transaction = require("../models/transactionModel");

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
        const userId = req.user._id;
        const transactions = await Transaction.find({
            userId
        }).sort({ transactionDate: -1 });

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

module.exports = { addTransaction, getTransactions, getTransactionById };