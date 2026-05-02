jest.mock("../../src/models/transactionModel");

const Transaction = require("../../src/models/transactionModel");

const {
    getSummaryService,
    getMonthlyTrendsService,
    getYearlyTrendsService
} = require("../../src/services/analyticsServices");

describe("analyticsServices (UNIT)", () => {

    const userId = "user123";

    const buildReq = (query = {}) => ({
        user: { _id: userId },
        query
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // summary
    test("should return summary", async () => {

        Transaction.aggregate.mockResolvedValue([
            { totalIncome: 1000, totalExpense: 500 }
        ]);

        const result = await getSummaryService(buildReq());

        expect(result).toBeDefined();
    });

    // monthly
    test("should return monthly trends", async () => {

        Transaction.aggregate.mockResolvedValue([
            {
                _id: { year: 2024, month: 1 },
                income: 1000,
                expense: 500
            }
        ]);

        const result = await getMonthlyTrendsService(buildReq());

        expect(result[0].year).toBe(2024);
        expect(result[0].month).toBe(1);
    });

    test("should return empty monthly trends", async () => {

        Transaction.aggregate.mockResolvedValue([]);

        const result = await getMonthlyTrendsService(buildReq());

        expect(result).toEqual([]);
    });

    // yearly
    test("should return yearly trends", async () => {

        Transaction.aggregate.mockResolvedValue([
            {
                _id: { year: 2024 },
                income: 1000,
                expense: 500
            }
        ]);

        const result = await getYearlyTrendsService(buildReq());

        expect(result[0].year).toBe(2024);
    });

    test("should return empty yearly trends", async () => {

        Transaction.aggregate.mockResolvedValue([]);

        const result = await getYearlyTrendsService(buildReq());

        expect(result).toEqual([]);
    });

});