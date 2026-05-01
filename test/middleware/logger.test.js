const { logger } = require("../../src/middlewares/logger");

describe("Logger Middleware", () => {

    let req, res, next;
    let consoleSpy;

    beforeEach(() => {
        req = {
            url: "/api/test"
        };

        res = {};
        next = jest.fn();

        process.env.PORT = "3000";

        // Mock console.log
        consoleSpy = jest.spyOn(console, "log").mockImplementation(() => { });
    });

    afterEach(() => {
        consoleSpy.mockRestore();
        jest.clearAllMocks();
    });

    test("should log request and call next()", () => {
        logger(req, res, next);

        expect(consoleSpy).toHaveBeenCalledWith(
            "-- Request received: http://localhost:3000/api/test"
        );

        expect(next).toHaveBeenCalled();
    });

});