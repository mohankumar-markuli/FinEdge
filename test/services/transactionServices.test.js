const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Transaction = require("../../src/models/transactionModel");

const {
    createTransactionService,
    getTransactionsService,
    getRecentTransactionsService,
    getTransactionByIdService,
    updateTransactionService,
    deleteTransactionService,
    transactionFilter
} = require("../../src/services/transactionServices");

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

describe("transactionService", () => {

    // ================= CREATE =================
    describe("createTransactionService", () => {

        test("should create transaction (happy case)", async () => {
            const data = {
                type: "expense",
                category: "food",
                amount: 500,
                paymentMethod: "upi",
                transactionDate: new Date()
            };

            const result = await createTransactionService(userId, data);

            expect(result._id).toBeDefined();
            expect(result.amount).toBe(500);
        });

    });

    // ================= GET TRANSACTIONS =================
    describe("getTransactionsService", () => {

        test("should return paginated transactions", async () => {
            await Transaction.create([
                { userId, type: "expense", category: "food", amount: 100 },
                { userId, type: "income", category: "salary", amount: 1000 }
            ]);

            const result = await getTransactionsService({ userId }, 1, 10);

            expect(result.transactions.length).toBe(2);
            expect(result.total).toBe(2);
        });

    });

    // ================= RECENT =================
    describe("getRecentTransactionsService", () => {

        test("should return recent transactions", async () => {
            await Transaction.create([
                { userId, type: "expense", category: "food", amount: 100 },
                { userId, type: "expense", category: "rent", amount: 200 }
            ]);

            const result = await getRecentTransactionsService(userId, 1);

            expect(result.length).toBe(1);
        });

    });

    // ================= GET BY ID =================
    describe("getTransactionByIdService", () => {

        test("should return transaction (happy case)", async () => {
            const txn = await Transaction.create({
                userId,
                type: "expense",
                category: "food",
                amount: 100
            });

            const result = await getTransactionByIdService(userId, txn._id);

            expect(result._id.toString()).toBe(txn._id.toString());
        });

        test("should throw if not found", async () => {
            const id = new mongoose.Types.ObjectId();

            await expect(
                getTransactionByIdService(userId, id)
            ).rejects.toThrow("Transaction not found");
        });

    });

    // ================= UPDATE =================
    describe("updateTransactionService", () => {

        test("should update transaction (happy case)", async () => {
            const txn = await Transaction.create({
                userId,
                type: "expense",
                category: "food",
                amount: 100
            });

            const updated = await updateTransactionService(
                userId,
                txn._id,
                { amount: 500 }
            );

            expect(updated.amount).toBe(500);
        });

        test("should throw if transaction not found", async () => {
            const id = new mongoose.Types.ObjectId();

            await expect(
                updateTransactionService(userId, id, { amount: 200 })
            ).rejects.toThrow("Transaction not found");
        });

    });

    // ================= DELETE =================
    describe("deleteTransactionService", () => {

        test("should delete transaction (happy case)", async () => {
            const txn = await Transaction.create({
                userId,
                type: "expense",
                category: "food",
                amount: 100
            });

            const result = await deleteTransactionService(userId, txn._id);

            expect(result._id.toString()).toBe(txn._id.toString());
        });

        test("should throw if not found", async () => {
            const id = new mongoose.Types.ObjectId();

            await expect(
                deleteTransactionService(userId, id)
            ).rejects.toThrow("Transaction not found");
        });

    });

    // ================= FILTER =================
    describe("transactionFilter", () => {

        test("should build basic filter", () => {
            const req = {
                user: { _id: userId },
                query: { category: "food" }
            };

            const filter = transactionFilter(req);

            expect(filter.userId).toEqual(userId);
            expect(filter.category).toBe("food");
        });

        test("should handle date range", () => {
            const req = {
                user: { _id: userId },
                query: {
                    startDate: "2026-01-01",
                    endDate: "2026-12-31"
                }
            };

            const filter = transactionFilter(req);

            expect(filter.transactionDate.$gte).toBeDefined();
            expect(filter.transactionDate.$lte).toBeDefined();
        });

        test("should throw on invalid startDate", () => {
            const req = {
                user: { _id: userId },
                query: { startDate: "invalid-date" }
            };

            expect(() => transactionFilter(req))
                .toThrow("Invalid startDate");
        });

        test("should apply search filter", () => {
            const req = {
                user: { _id: userId },
                query: { search: "food" }
            };

            const filter = transactionFilter(req);

            expect(filter.$or).toBeDefined();
        });

    });

});