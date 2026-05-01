const { errorHandler } = require("../../src/middlewares/errorHandler");

describe("errorHandler Middleware", () => {

    let req, res;

    beforeEach(() => {
        req = {};

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
    });

    // success state 
    test("should return custom error with status", () => {
        const err = {
            message: "Bad Request",
            status: 400
        };

        errorHandler(err, req, res, () => { });

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Bad Request"
        });
    });

    // defalut state
    test("should default to 500 if status not provided", () => {
        const err = {
            message: "Something went wrong"
        };

        errorHandler(err, req, res, () => { });

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Something went wrong"
        });
    });

    // default message 
    test("should default message if not provided", () => {
        const err = {
            status: 500
        };

        errorHandler(err, req, res, () => { });

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Internal Server Error"
        });
    });

});