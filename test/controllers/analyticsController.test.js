// mocks
jest.mock("../../src/services/analyticsServices", () => ({
    getSummaryService: jest.fn(),
    getMonthlyTrendsService: jest.fn(),
    getYearlyTrendsService: jest.fn()
}));

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

describe("Analytics Controller", () => {

    let req, res, next;

    beforeEach(() => {
        req = {
            user: { currency: "INR" }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();

        jest.clearAllMocks();
    });

    // summary
    describe("getSummary", () => {

        test("should return summary successfully", async () => {
            const mockData = {
                totalIncome: 1000,
                totalExpense: 200,
                balance: 800
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
            const error = new Error("Summary error");

            getSummaryService.mockRejectedValue(error);

            await getSummary(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });

    });

    // monthly
    describe("getMonthlyTrends", () => {

        test("should return monthly trends", async () => {
            const mockData = [];

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
            const error = new Error("Monthly error");

            getMonthlyTrendsService.mockRejectedValue(error);

            await getMonthlyTrends(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });

    });

    // yearly
    describe("getYearlyTrends", () => {

        test("should return yearly trends", async () => {
            const mockData = [];

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
            const error = new Error("Yearly error");

            getYearlyTrendsService.mockRejectedValue(error);

            await getYearlyTrends(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });

    });

});