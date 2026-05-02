jest.setTimeout(20000);

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
    await mongoose.connect(mongoServer.getUri(), { dbName: "test-db" });
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

    // create
    describe("createTransactionService", () => {

        test("should create transaction", async () => {
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

    // get transaction
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

        test("should return empty transactions", async () => {
            const result = await getTransactionsService({ userId }, 1, 10);

            expect(result.transactions).toEqual([]);
            expect(result.total).toBe(0);
        });

    });

    // recent
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

    // get by id
    describe("getTransactionByIdService", () => {

        test("should return transaction", async () => {
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

    // update
    describe("updateTransactionService", () => {

        test("should update transaction", async () => {
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

        // force branch
        test("should throw if update returns null (mock)", async () => {
            jest.spyOn(Transaction, "findOneAndUpdate").mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            await expect(
                updateTransactionService("user", "id", {})
            ).rejects.toThrow("Transaction not found");

            jest.restoreAllMocks();
        });

    });

    // delete
    describe("deleteTransactionService", () => {

        test("should delete transaction", async () => {
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

        // force branch
        test("should throw if delete returns null (mock)", async () => {
            jest.spyOn(Transaction, "findOneAndDelete").mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            await expect(
                deleteTransactionService("user", "id")
            ).rejects.toThrow("Transaction not found");

            jest.restoreAllMocks();
        });

    });

    // filter
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

        test("should handle category as array", () => {
            const req = {
                user: { _id: userId },
                query: { category: ["food", "rent"] }
            };

            const filter = transactionFilter(req);

            expect(filter.category.$in).toEqual(["food", "rent"]);
        });

        test("should handle type as array", () => {
            const req = {
                user: { _id: userId },
                query: { type: ["income", "expense"] }
            };

            const filter = transactionFilter(req);

            expect(filter.type.$in).toEqual(["income", "expense"]);
        });

        test("should handle paymentMethod as array", () => {
            const req = {
                user: { _id: userId },
                query: { paymentMethod: ["upi", "cash"] }
            };

            const filter = transactionFilter(req);

            expect(filter.paymentMethod.$in).toEqual(["upi", "cash"]);
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
                query: { startDate: "invalid" }
            };

            expect(() => transactionFilter(req))
                .toThrow("Invalid startDate");
        });

        test("should throw on invalid endDate", () => {
            const req = {
                user: { _id: userId },
                query: { endDate: "invalid" }
            };

            expect(() => transactionFilter(req))
                .toThrow("Invalid endDate");
        });

        test("should apply search filter", () => {
            const req = {
                user: { _id: userId },
                query: { search: "food" }
            };

            const filter = transactionFilter(req);

            expect(filter.$or).toBeDefined();
        });

        test("should work with empty query", () => {
            const req = {
                user: { _id: userId },
                query: {}
            };

            const filter = transactionFilter(req);

            expect(filter.userId).toEqual(userId);
        });

    });

});