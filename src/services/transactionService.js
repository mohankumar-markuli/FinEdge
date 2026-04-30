const transactionFilter = (req) => {
    const userId = req.user._id;
    const { category, type, startDate, endDate, paymentMethod, search } = req.query;

    const filter = { userId };

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (paymentMethod) filter.paymentMethod = paymentMethod;


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

module.exports = { transactionFilter };