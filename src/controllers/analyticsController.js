const Transaction = require("../models/transactionModel");
const { transactionFilter } = require("../services/transactionService");

const getSummary = async (req, res) => {
    try {
        const filter = transactionFilter(req);

        const result = await Transaction.aggregate([
            {
                $match: filter
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        let totalIncome = 0;
        let totalExpense = 0;

        result.forEach((item) => {
            if (item._id === "income") totalIncome = item.total;
            if (item._id === "expense") totalExpense = item.total;
        });

        const balance = totalIncome - totalExpense;

        res.status(200).json({
            message: "Summary fetched successfully",
            data: {
                totalIncome,
                totalExpense,
                balance
            },
            currency: req.user.currency
        });

    } catch (err) {
        console.error(new Date().toISOString(), "ERROR:", err.message);

        res.status(500).json({
            message: "Failed to fetch summary",
            error: err.message
        });
    }
};

const getMonthlyTrends = async (req, res) => {
    try {
        const filter = transactionFilter(req);

        const result = await Transaction.aggregate([
            {
                $match: filter
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$transactionDate" },
                        month: { $month: "$transactionDate" }
                    },
                    income: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
                        }
                    },
                    expense: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
                        }
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        const formatted = result.map((item) => ({
            year: item._id.year,
            month: item._id.month,
            income: item.income,
            expense: item.expense,
            balance: item.income - item.expense
        }));

        res.status(200).json({
            message: "Monthly trends fetched successfully",
            data: formatted
        });

    } catch (err) {
        console.error(new Date().toISOString(), "ERROR:", err.message);

        res.status(500).json({
            message: "Failed to fetch monthly trends",
            error: err.message
        });
    }
}
module.exports = { getSummary, getMonthlyTrends }