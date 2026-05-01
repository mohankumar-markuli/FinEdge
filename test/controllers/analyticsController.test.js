const {
    getSummary,
    getMonthlyTrends,
    getYearlyTrends
} = require("../../src/controllers/analyticsController");

const {
    getSummaryService,
    getMonthlyTrendsService,
    getYearlyTrendsService
} = require("../../src/services/analyticsServices");

// ---- MOCK SERVICES ----
jest.mock("../../src/services/analyticsServices");

describe("Analytics Controller Unit Tests", () => {

    let req, res, next;

    beforeEach(() => {
        req = {
            user: {
                _id: "user123",
                currency: "INR"
            },
            query: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();

        jest.clearAllMocks();
    });

    // ================= SUMMARY =================
    describe("getSummary", () => {

        test("should return summary successfully", async () => {
            const mockData = {
                totalIncome: 1000,
                totalExpense: 500,
                balance: 500
            };

            getSummaryService.mockResolvedValue(mockData);

            await getSummary(req, res, next);

            expect(getSummaryService).toHaveBeenCalledWith(req);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Summary fetched successfully",
                data: mockData,
                currency: "INR"
            });
        });

        test("should call next on error", async () => {
            getSummaryService.mockRejectedValue(new Error("Error"));

            await getSummary(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // ================= MONTHLY =================
    describe("getMonthlyTrends", () => {

        test("should return monthly trends successfully", async () => {
            const mockData = [
                { month: 1, income: 1000, expense: 200 }
            ];

            getMonthlyTrendsService.mockResolvedValue(mockData);

            await getMonthlyTrends(req, res, next);

            expect(getMonthlyTrendsService).toHaveBeenCalledWith(req);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Monthly trends fetched successfully",
                data: mockData
            });
        });

        test("should call next on error", async () => {
            getMonthlyTrendsService.mockRejectedValue(new Error("Error"));

            await getMonthlyTrends(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // ================= YEARLY =================
    describe("getYearlyTrends", () => {

        test("should return yearly trends successfully", async () => {
            const mockData = [
                { year: 2026, income: 5000, expense: 2000 }
            ];

            getYearlyTrendsService.mockResolvedValue(mockData);

            await getYearlyTrends(req, res, next);

            expect(getYearlyTrendsService).toHaveBeenCalledWith(req);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Yearly trends fetched successfully",
                data: mockData
            });
        });

        test("should call next on error", async () => {
            getYearlyTrendsService.mockRejectedValue(new Error("Error"));

            await getYearlyTrends(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

});