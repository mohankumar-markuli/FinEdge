const Transaction = require("../models/transactionModel");

const createTransactionService = async (userId, body) => {
    const transaction = await Transaction.create({
        userId,
        ...body
    });

    return sanitize(transaction);
};

const getTransactionsService = async (filter, page, limit) => {
    const transactions = await Transaction.find(filter)
        .sort({ transactionDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("_id type category amount paymentMethod transactionDate merchant description");

    const total = await Transaction.countDocuments(filter);

    return { transactions, total };
};

const getRecentTransactionsService = async (userId, limit) => {
    return await Transaction.find({ userId })
        .sort({ transactionDate: -1 })
        .limit(limit)
        .select("category amount transactionDate");
};

const getTransactionByIdService = async (userId, transactionId) => {
    const transaction = await Transaction.findOne({
        userId,
        _id: transactionId
    })
        .select("_id type category amount paymentMethod transactionDate merchant description")
        .lean();

    if (!transaction) {
        const error = new Error("Transaction not found");
        error.statusCode = 404;
        throw error;
    }

    return transaction;
};

const updateTransactionService = async (userId, transactionId, updateData) => {

    const transaction = await Transaction.findOneAndUpdate(
        { _id: transactionId, userId },
        { $set: updateData },
        { returnDocument: "after", runValidators: true }
    ).select("_id type category amount paymentMethod transactionDate merchant description");

    if (!transaction) throw new Error("Transaction not found");

    return transaction;
};

const deleteTransactionService = async (userId, transactionId) => {
    const transaction = await Transaction.findOneAndDelete({
        _id: transactionId,
        userId,
    }).select("_id type category amount");

    if (!transaction) {
        const error = new Error("Transaction not found");
        error.statusCode = 404;
        throw error;
    }

    return transaction;
};

const sanitize = (t) => ({
    _id: t._id,
    type: t.type,
    category: t.category,
    amount: t.amount,
    paymentMethod: t.paymentMethod,
    transactionDate: t.transactionDate,
    merchant: t.merchant,
    description: t.description,
});

const transactionFilter = (req) => {
    userId = req.user._id;
    const { category, type, startDate, endDate, paymentMethod, search } = req.query;

    const filter = { userId };

    if (category) {
        if (Array.isArray(category)) {
            filter.category = { $in: category };
        } else {
            filter.category = category;
        }
    }

    if (type) {
        if (Array.isArray(type)) {
            filter.type = { $in: type };
        } else {
            filter.type = type;
        }
    }

    if (paymentMethod) {
        if (Array.isArray(paymentMethod)) {
            filter.paymentMethod = { $in: paymentMethod };
        } else {
            filter.paymentMethod = paymentMethod;
        }
    }


    if (startDate || endDate) {
        filter.transactionDate = {};

        if (startDate) {
            const start = new Date(startDate);
            if (isNaN(start.getTime())) {
                throw new Error("Invalid startDate");
            }
            filter.transactionDate.$gte = start;
        }

        if (endDate) {
            const end = new Date(endDate);
            if (isNaN(end.getTime())) {
                throw new Error("Invalid endDate");
            }

            end.setHours(23, 59, 59, 999);
            filter.transactionDate.$lte = end;
        }
    }

    if (search) {
        filter.$or = [
            { description: { $regex: search, $options: "i" } },
            { merchant: { $regex: search, $options: "i" } }
        ];
    }

    return filter;
};

module.exports = {
    createTransactionService,
    getTransactionsService,
    getRecentTransactionsService,
    getTransactionByIdService,
    updateTransactionService,
    deleteTransactionService,
    transactionFilter
};