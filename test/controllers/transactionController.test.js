jest.mock("../../src/services/transactionServices", () => ({
    createTransactionService: jest.fn(),
    getTransactionsService: jest.fn(),
    getRecentTransactionsService: jest.fn(),
    getTransactionByIdService: jest.fn(),
    updateTransactionService: jest.fn(),
    deleteTransactionService: jest.fn(),
    transactionFilter: jest.fn()
}));

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

    // add
    describe("addTransaction", () => {

        test("should add transaction successfully", async () => {
            const mockData = { category: "food", amount: 100 };

            createTransactionService.mockResolvedValue(mockData);

            await addTransaction(req, res, next);

            expect(createTransactionService).toHaveBeenCalledWith("user123", req.body);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Test added transaction - food : 100 INR",
                data: mockData
            });
        });

        test("should call next on error", async () => {
            createTransactionService.mockRejectedValue(new Error("Error"));

            await addTransaction(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // get all
    describe("getTransactions", () => {

        test("should fetch transactions successfully", async () => {
            req.query = { page: "1", limit: "10" };

            transactionFilter.mockReturnValue({});
            getTransactionsService.mockResolvedValue({
                transactions: [{ _id: "1" }],
                total: 1
            });

            await getTransactions(req, res, next);

            expect(getTransactionsService).toHaveBeenCalledWith({}, 1, 10);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        test("should default page and limit when invalid", async () => {
            req.query = { page: "abc", limit: "xyz" };

            transactionFilter.mockReturnValue({});
            getTransactionsService.mockResolvedValue({
                transactions: [],
                total: 0
            });

            await getTransactions(req, res, next);

            expect(getTransactionsService).toHaveBeenCalledWith({}, 1, 10);
        });

        test("should clamp page to minimum 1", async () => {
            req.query = { page: "0", limit: "5" };

            transactionFilter.mockReturnValue({});
            getTransactionsService.mockResolvedValue({
                transactions: [],
                total: 0
            });

            await getTransactions(req, res, next);

            expect(getTransactionsService).toHaveBeenCalledWith({}, 1, 5);
        });

        test("should clamp limit to max 50", async () => {
            req.query = { page: "1", limit: "100" };

            transactionFilter.mockReturnValue({});
            getTransactionsService.mockResolvedValue({
                transactions: [],
                total: 0
            });

            await getTransactions(req, res, next);

            expect(getTransactionsService).toHaveBeenCalledWith({}, 1, 50);
        });

        test("should call next on error", async () => {
            transactionFilter.mockImplementation(() => {
                throw new Error("Filter error");
            });

            await getTransactions(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // recent
    describe("getRecentTransactions", () => {

        test("should fetch recent transactions", async () => {
            req.query = { limit: "5" };

            getRecentTransactionsService.mockResolvedValue([{ _id: "1" }]);

            await getRecentTransactions(req, res, next);

            expect(getRecentTransactionsService).toHaveBeenCalledWith("user123", 5);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        test("should call next on error", async () => {
            getRecentTransactionsService.mockRejectedValue(new Error("Error"));

            await getRecentTransactions(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // get by id
    describe("getTransaction", () => {

        test("should fetch transaction by id", async () => {
            req.params.transactionId = "txn1";

            getTransactionByIdService.mockResolvedValue({ _id: "txn1" });

            await getTransaction(req, res, next);

            expect(getTransactionByIdService).toHaveBeenCalledWith("user123", "txn1");

            expect(res.status).toHaveBeenCalledWith(200);
        });

        test("should call next on error", async () => {
            getTransactionByIdService.mockRejectedValue(new Error("Error"));

            await getTransaction(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // update
    describe("updateTransaction", () => {

        test("should update transaction successfully", async () => {
            req.params.transactionId = "txn1";

            updateTransactionService.mockResolvedValue({ _id: "txn1", amount: 200 });

            await updateTransaction(req, res, next);

            expect(updateTransactionService).toHaveBeenCalledWith("user123", "txn1", req.body);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        test("should call next on error", async () => {
            updateTransactionService.mockRejectedValue(new Error("Error"));

            await updateTransaction(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // delete
    describe("deleteTransaction", () => {

        test("should delete transaction successfully", async () => {
            req.params.transactionId = "txn1";

            deleteTransactionService.mockResolvedValue({ _id: "txn1" });

            await deleteTransaction(req, res, next);

            expect(deleteTransactionService).toHaveBeenCalledWith("user123", "txn1");

            expect(res.status).toHaveBeenCalledWith(200);
        });

        test("should call next on error", async () => {
            deleteTransactionService.mockRejectedValue(new Error("Error"));

            await deleteTransaction(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

});