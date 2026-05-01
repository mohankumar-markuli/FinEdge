const { getSummaryService,
    getMonthlyTrendsService,
    getYearlyTrendsService } = require("../services/analyticsServices");

const getSummary = async (req, res, next) => {
    try {
        const data = await getSummaryService(req);

        return res.status(200).json({
            message: "Summary fetched successfully",
            data,
            currency: req.user.currency
        });

    } catch (err) {
        next(err);
    }
};

const getMonthlyTrends = async (req, res, next) => {
    try {
        const data = await getMonthlyTrendsService(req);

        return res.status(200).json({
            message: "Monthly trends fetched successfully",
            data
        });

    } catch (err) {
        next(err);
    }
};

const getYearlyTrends = async (req, res, next) => {
    try {
        const data = await getYearlyTrendsService(req);

        return res.status(200).json({
            message: "Yearly trends fetched successfully",
            data
        });

    } catch (err) {
        next(err);
    }
};

module.exports = { getSummary, getMonthlyTrends, getYearlyTrends }