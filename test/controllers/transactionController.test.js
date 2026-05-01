const {
    addTransaction,
    getTransactions,
    getRecentTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction
} = require("../../src/controllers/transactionController");

const {
    createTransactionService,
    getTransactionsService,
    getRecentTransactionsService,
    getTransactionByIdService,
    updateTransactionService,
    deleteTransactionService,
    transactionFilter
} = require("../../src/services/transactionServices");

// ---- MOCK SERVICES ----
jest.mock("../../src/services/transactionServices");

describe("Transaction Controller Unit Tests", () => {

    let req, res, next;

    beforeEach(() => {
        req = {
            user: {
                _id: "user123",
                firstName: "Test",
                currency: "INR"
            },
            body: {},
            query: {},
            params: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();

        jest.clearAllMocks();
    });

    // ================= ADD =================
    describe("addTransaction", () => {

        test("should add transaction successfully", async () => {
            const mockData = {
                category: "food",
                amount: 100
            };

            createTransactionService.mockResolvedValue(mockData);

            await addTransaction(req, res, next);

            expect(createTransactionService).toHaveBeenCalledWith("user123", req.body);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: `Test added transaction - food : 100 INR`,
                data: mockData
            });
        });

        test("should call next on error", async () => {
            createTransactionService.mockRejectedValue(new Error("Error"));

            await addTransaction(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // ================= GET ALL =================
    describe("getTransactions", () => {

        test("should fetch transactions successfully", async () => {
            const mockFilter = {};
            const mockTransactions = [{ _id: "1" }];
            const mockTotal = 1;

            req.query = { page: "1", limit: "10" };

            transactionFilter.mockReturnValue(mockFilter);
            getTransactionsService.mockResolvedValue({
                transactions: mockTransactions,
                total: mockTotal
            });

            await getTransactions(req, res, next);

            expect(transactionFilter).toHaveBeenCalled();
            expect(getTransactionsService).toHaveBeenCalledWith(mockFilter, 1, 10);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
        });

        test("should call next on error", async () => {
            transactionFilter.mockImplementation(() => {
                throw new Error("Filter error");
            });

            await getTransactions(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // ================= RECENT =================
    describe("getRecentTransactions", () => {

        test("should fetch recent transactions", async () => {
            const mockData = [{ _id: "1" }];

            req.query = { limit: "5" };

            getRecentTransactionsService.mockResolvedValue(mockData);

            await getRecentTransactions(req, res, next);

            expect(getRecentTransactionsService).toHaveBeenCalledWith("user123", 5);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Recent transactions fetched successfully",
                data: mockData
            });
        });

        test("should call next on error", async () => {
            getRecentTransactionsService.mockRejectedValue(new Error("Error"));

            await getRecentTransactions(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // ================= GET BY ID =================
    describe("getTransaction", () => {

        test("should fetch transaction by id", async () => {
            const mockTransaction = { _id: "txn1" };

            req.params.transactionId = "txn1";

            getTransactionByIdService.mockResolvedValue(mockTransaction);

            await getTransaction(req, res, next);

            expect(getTransactionByIdService).toHaveBeenCalledWith("user123", "txn1");

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Transaction fetched successfully",
                data: mockTransaction
            });
        });

        test("should call next on error", async () => {
            getTransactionByIdService.mockRejectedValue(new Error("Error"));

            await getTransaction(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // ================= UPDATE =================
    describe("updateTransaction", () => {

        test("should update transaction successfully", async () => {
            const updatedData = { _id: "txn1", amount: 200 };

            req.params.transactionId = "txn1";

            updateTransactionService.mockResolvedValue(updatedData);

            await updateTransaction(req, res, next);

            expect(updateTransactionService).toHaveBeenCalledWith(
                "user123",
                "txn1",
                req.body
            );

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Transaction Updated Successfully",
                data: updatedData
            });
        });

        test("should call next on error", async () => {
            updateTransactionService.mockRejectedValue(new Error("Error"));

            await updateTransaction(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // ================= DELETE =================
    describe("deleteTransaction", () => {

        test("should delete transaction successfully", async () => {
            const deletedData = { _id: "txn1" };

            req.params.transactionId = "txn1";

            deleteTransactionService.mockResolvedValue(deletedData);

            await deleteTransaction(req, res, next);

            expect(deleteTransactionService).toHaveBeenCalledWith("user123", "txn1");

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Transaction deleted successfully",
                data: deletedData
            });
        });

        test("should call next on error", async () => {
            deleteTransactionService.mockRejectedValue(new Error("Error"));

            await deleteTransaction(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

});