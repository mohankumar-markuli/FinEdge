const { userSignUp, userLogin, userlogout } = require("../../src/controllers/authController");

const User = require("../../src/models/userModel");
const { getJWT, getHashPassword } = require("../../src/services/authServices");
const { validateSignUpData, validatePassword } = require("../../src/middlewares/validator");

// ---- MOCK DEPENDENCIES ----
jest.mock("../../src/models/userModel");
jest.mock("../../src/services/authServices");
jest.mock("../../src/middlewares/validator");

describe("Auth Controller Unit Tests", () => {

    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            cookies: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
            clearCookie: jest.fn()
        };

        next = jest.fn();

        jest.clearAllMocks();
    });

    // ================= SIGNUP =================
    describe("userSignUp", () => {

        test("should register user successfully", async () => {
            req.body = {
                firstName: "Test",
                lastName: "User",
                emailId: "test@example.com",
                password: "Strong@123!",
                currency: "INR"
            };

            validateSignUpData.mockImplementation(() => { });
            User.findOne.mockResolvedValue(null);
            getHashPassword.mockResolvedValue("hashed_password");

            const mockSavedUser = {
                _id: "123",
                firstName: "Test",
                lastName: "User",
                emailId: "test@example.com",
                currency: "INR"
            };

            User.prototype.save = jest.fn().mockResolvedValue(mockSavedUser);
            getJWT.mockResolvedValue("token123");

            await userSignUp(req, res, next);

            expect(validateSignUpData).toHaveBeenCalledWith(req);
            expect(User.findOne).toHaveBeenCalledWith({ emailId: "test@example.com" });
            expect(getHashPassword).toHaveBeenCalledWith("Strong@123!");
            expect(getJWT).toHaveBeenCalledWith(mockSavedUser);

            expect(res.cookie).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalled();
        });

        test("should throw error if user already exists", async () => {
            req.body = { emailId: "test@example.com" };

            validateSignUpData.mockImplementation(() => { });
            User.findOne.mockResolvedValue({ _id: "existing" });

            await userSignUp(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(next.mock.calls[0][0].message).toBe("User already exists");
        });

        test("should call next on validation error", async () => {
            validateSignUpData.mockImplementation(() => {
                throw new Error("Validation failed");
            });

            await userSignUp(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // ================= LOGIN =================
    describe("userLogin", () => {

        test("should login successfully", async () => {
            req.body = {
                emailId: "test@example.com",
                password: "Strong@123!"
            };

            const mockUser = {
                _id: "123",
                firstName: "Test",
                lastName: "User",
                emailId: "test@example.com",
                currency: "INR"
            };

            User.findOne.mockResolvedValue(mockUser);
            validatePassword.mockResolvedValue(true);
            getJWT.mockResolvedValue("token123");

            await userLogin(req, res, next);

            expect(User.findOne).toHaveBeenCalledWith({ emailId: "test@example.com" });
            expect(validatePassword).toHaveBeenCalledWith(mockUser, "Strong@123!");
            expect(getJWT).toHaveBeenCalledWith(mockUser);

            expect(res.cookie).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
        });

        test("should fail if email or password missing", async () => {
            req.body = {};

            await userLogin(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(next.mock.calls[0][0].message).toBe("Email and password are required");
        });

        test("should fail if user not found", async () => {
            req.body = {
                emailId: "test@example.com",
                password: "123"
            };

            User.findOne.mockResolvedValue(null);

            await userLogin(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(next.mock.calls[0][0].message).toBe("User not found. Please sign up.");
        });

        test("should fail if password invalid", async () => {
            req.body = {
                emailId: "test@example.com",
                password: "wrong"
            };

            User.findOne.mockResolvedValue({ _id: "123" });
            validatePassword.mockResolvedValue(false);

            await userLogin(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(next.mock.calls[0][0].message).toBe("Invalid credentials");
        });

    });

    // ================= LOGOUT =================
    describe("userlogout", () => {

        test("should logout successfully", async () => {
            await userlogout(req, res, next);

            expect(res.clearCookie).toHaveBeenCalledWith("token", {
                httpOnly: true,
                sameSite: "strict"
            });

            expect(res.json).toHaveBeenCalledWith({
                message: "Logout Successful"
            });
        });

    });

});