const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Transaction = require("../../src/models/transactionModel");

const {
    getSummaryService,
    getMonthlyTrendsService,
    getYearlyTrendsService
} = require("../../src/services/analyticsServices");

let mongoServer;
let userId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

beforeEach(async () => {
    await mongoose.connection.dropDatabase();
    userId = new mongoose.Types.ObjectId();
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

const buildReq = (query = {}) => ({
    user: { _id: userId },
    query
});

describe("analyticsServices", () => {

    // ================= SUMMARY =================
    describe("getSummaryService", () => {

        test("should return correct summary (happy case)", async () => {
            await Transaction.create([
                { userId, type: "income", category: "salary", amount: 1000 },
                { userId, type: "expense", category: "food", amount: 200 }
            ]);

            const result = await getSummaryService(buildReq());

            expect(result.totalIncome).toBe(1000);
            expect(result.totalExpense).toBe(200);
            expect(result.balance).toBe(800);
        });

        test("should return zero values if no transactions", async () => {
            const result = await getSummaryService(buildReq());

            expect(result.totalIncome).toBe(0);
            expect(result.totalExpense).toBe(0);
            expect(result.balance).toBe(0);
        });

    });

    // ================= MONTHLY =================
    describe("getMonthlyTrendsService", () => {

        test("should return monthly trends correctly", async () => {
            await Transaction.create([
                {
                    userId,
                    type: "income",
                    category: "salary",
                    amount: 1000,
                    transactionDate: new Date("2026-01-10")
                },
                {
                    userId,
                    type: "expense",
                    category: "food",
                    amount: 200,
                    transactionDate: new Date("2026-01-15")
                }
            ]);

            const result = await getMonthlyTrendsService(buildReq());

            expect(result.length).toBe(1);
            expect(result[0].income).toBe(1000);
            expect(result[0].expense).toBe(200);
            expect(result[0].balance).toBe(800);
        });

        test("should return empty array if no data", async () => {
            const result = await getMonthlyTrendsService(buildReq());

            expect(result).toEqual([]);
        });

    });

    // ================= YEARLY =================
    describe("getYearlyTrendsService", () => {

        test("should return yearly trends correctly", async () => {
            await Transaction.create([
                {
                    userId,
                    type: "income",
                    category: "salary",
                    amount: 2000,
                    transactionDate: new Date("2025-05-01")
                },
                {
                    userId,
                    type: "expense",
                    category: "rent",
                    amount: 500,
                    transactionDate: new Date("2025-06-01")
                }
            ]);

            const result = await getYearlyTrendsService(buildReq());

            expect(result.length).toBe(1);
            expect(result[0].year).toBe(2025);
            expect(result[0].income).toBe(2000);
            expect(result[0].expense).toBe(500);
            expect(result[0].balance).toBe(1500);
        });

        test("should return empty array if no data", async () => {
            const result = await getYearlyTrendsService(buildReq());

            expect(result).toEqual([]);
        });

    });

});