const { userAuth } = require("../../src/middlewares/userAuth");

const jwt = require("jsonwebtoken");
const User = require("../../src/models/userModel");

// mockes
jest.mock("jsonwebtoken");
jest.mock("../../src/models/userModel");

describe("userAuth Middleware", () => {

    let req, res, next;

    beforeEach(() => {
        req = {
            cookies: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        next = jest.fn();

        jest.clearAllMocks();
    });

    // success
    test("should authenticate user and call next()", async () => {
        req.cookies.token = "validToken";

        const mockUser = { _id: "123", firstName: "Test" };

        jwt.verify.mockReturnValue({ _id: "123" });
        User.findById.mockResolvedValue(mockUser);

        await userAuth(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            "validToken",
            process.env.JWT_SECRET_KEY
        );

        expect(User.findById).toHaveBeenCalledWith("123");

        expect(req.user).toBe(mockUser);
        expect(next).toHaveBeenCalled();
    });

    // no token
    test("should return 401 if token missing", async () => {
        req.cookies = {};

        await userAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("Plase login");
        expect(next).not.toHaveBeenCalled();
    });

    // invalid token
    test("should return 401 if token invalid", async () => {
        req.cookies.token = "invalidToken";

        jwt.verify.mockImplementation(() => {
            throw new Error("Invalid token");
        });

        await userAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("Invalid token");
    });

    // user not found
    test("should return 401 if user not found", async () => {
        req.cookies.token = "validToken";

        jwt.verify.mockReturnValue({ _id: "123" });
        User.findById.mockResolvedValue(null);

        await userAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("User not found");
    });

});