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
}

module.exports = { addTransaction };