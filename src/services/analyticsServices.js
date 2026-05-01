const Transaction = require("../models/transactionModel");
const { transactionFilter } = require("../services/transactionServices");

const getSummaryService = async (req) => {
    const filter = transactionFilter(req);
    const result = await Transaction.aggregate([
        { $match: filter },
        {
            $group: {
                _id: "$type",
                total: { $sum: "$amount" }
            }
        }
    ]);

    const summary = result.reduce((acc, item) => {
        acc[item._id] = item.total;
        return acc;
    }, {});

    const totalIncome = summary.income || 0;
    const totalExpense = summary.expense || 0;

    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense
    };
};

const getMonthlyTrendsService = async (req) => {
    const filter = transactionFilter(req);

    const result = await Transaction.aggregate([
        { $match: filter },
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

    return result.map(item => ({
        year: item._id.year,
        month: item._id.month,
        income: item.income,
        expense: item.expense,
        balance: item.income - item.expense
    }));
};

const getYearlyTrendsService = async (req) => {
    const filter = transactionFilter(req);

    const result = await Transaction.aggregate([
        { $match: filter },
        {
            $group: {
                _id: {
                    year: { $year: "$transactionDate" }
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
            $sort: { "_id.year": 1 }
        }
    ]);

    return result.map(item => ({
        year: item._id.year,
        income: item.income,
        expense: item.expense,
        balance: item.income - item.expense
    }));
};

module.exports = {
    getSummaryService,
    getMonthlyTrendsService,
    getYearlyTrendsService
}
