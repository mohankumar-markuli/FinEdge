const {
    validateSignUpData,
    validatePassword,
    validateEditUserData,
    validateChangePassword,
    validateTransactionFields,
    validateEditTransactionData,
    validateObjectId
} = require("../../src/middlewares/validator");

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

jest.mock("bcrypt");

describe("Validator Middleware Tests", () => {

    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            user: { password: "hashed" },
            params: {}
        };

        res = {};
        next = jest.fn();

        jest.clearAllMocks();
    });

    // signup
    describe("validateSignUpData", () => {

        test("should pass valid data", () => {
            req.body = {
                firstName: "Test",
                emailId: "test@test.com",
                password: "Strong@123!",
                currency: "INR"
            };

            validateSignUpData(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        test("should fail missing firstName", () => {
            req.body = {
                emailId: "test@test.com",
                password: "Strong@123!",
                currency: "INR"
            };

            validateSignUpData(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail invalid email", () => {
            req.body = {
                firstName: "Test",
                emailId: "invalid",
                password: "Strong@123!",
                currency: "INR"
            };

            validateSignUpData(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail weak password", () => {
            req.body = {
                firstName: "Test",
                emailId: "test@test.com",
                password: "123",
                currency: "INR"
            };

            validateSignUpData(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail missing currency", () => {
            req.body = {
                firstName: "Test",
                emailId: "test@test.com",
                password: "Strong@123!"
            };

            validateSignUpData(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    // password
    describe("validatePassword", () => {

        test("should return true", async () => {
            bcrypt.compare.mockResolvedValue(true);

            const result = await validatePassword(
                { password: "hashed" },
                "input"
            );

            expect(result).toBe(true);
        });

        test("should return false", async () => {
            bcrypt.compare.mockResolvedValue(false);

            const result = await validatePassword(
                { password: "hashed" },
                "wrong"
            );

            expect(result).toBe(false);
        });
    });

    // edit user
    describe("validateEditUserData", () => {

        test("should pass valid fields", () => {
            req.body = { firstName: "New" };

            validateEditUserData(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        test("should fail empty body", () => {
            req.body = {};

            validateEditUserData(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail restricted field", () => {
            req.body = { password: "123" };

            validateEditUserData(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail invalid field", () => {
            req.body = { random: "field" };

            validateEditUserData(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    // change password
    describe("validateChangePassword", () => {

        test("should pass valid change", async () => {
            req.body = {
                password: "old",
                newPassword: "Strong@123!"
            };

            bcrypt.compare
                .mockResolvedValueOnce(true)
                .mockResolvedValueOnce(false);

            await validateChangePassword(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test("should fail missing fields", async () => {
            req.body = {};

            await validateChangePassword(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail weak new password", async () => {
            req.body = {
                password: "old",
                newPassword: "123"
            };

            await validateChangePassword(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail incorrect old password", async () => {
            req.body = {
                password: "wrong",
                newPassword: "Strong@123!"
            };

            bcrypt.compare.mockResolvedValue(false);

            await validateChangePassword(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail same password", async () => {
            req.body = {
                password: "old",
                newPassword: "old"
            };

            bcrypt.compare
                .mockResolvedValueOnce(true)
                .mockResolvedValueOnce(true);

            await validateChangePassword(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    // transaction
    describe("validateTransactionFields", () => {

        test("should pass valid data", () => {
            req.body = {
                type: "INCOME",
                category: "FOOD",
                amount: "100",
                paymentMethod: "UPI"
            };

            validateTransactionFields(req, res, next);

            expect(req.body.type).toBe("income");
            expect(req.body.amount).toBe(100);
            expect(next).toHaveBeenCalled();
        });

        test("should fail invalid amount", () => {
            req.body = { amount: -10 };

            validateTransactionFields(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail empty amount string", () => {
            req.body = { amount: "" };

            validateTransactionFields(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail invalid type", () => {
            req.body = { type: "invalid" };

            validateTransactionFields(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail invalid category", () => {
            req.body = { category: "wrong" };

            validateTransactionFields(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail invalid payment method", () => {
            req.body = { paymentMethod: "crypto" };

            validateTransactionFields(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail invalid date", () => {
            req.body = { transactionDate: "invalid-date" };

            validateTransactionFields(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail zero timestamp date", () => {
            req.body = { transactionDate: new Date(0) };

            validateTransactionFields(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should trim merchant", () => {
            req.body = { merchant: "  Amazon  ", amount: 100 };

            validateTransactionFields(req, res, next);

            expect(req.body.merchant).toBe("Amazon");
            expect(next).toHaveBeenCalled();
        });

        test("should trim description", () => {
            req.body = { description: "  test desc  ", amount: 100 };

            validateTransactionFields(req, res, next);

            expect(req.body.description).toBe("test desc");
            expect(next).toHaveBeenCalled();
        });
    });

    // edit transaction
    describe("validateEditTransactionData", () => {

        test("should pass valid edit", () => {
            req.body = { amount: 100 };

            validateEditTransactionData(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        test("should fail empty body", () => {
            req.body = {};

            validateEditTransactionData(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail restricted field", () => {
            req.body = { userId: "123" };

            validateEditTransactionData(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail inner transaction validation", () => {
            req.body = { amount: -100 };

            validateEditTransactionData(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    // object id
    describe("validateObjectId", () => {

        test("should pass valid id", () => {
            req.params.transactionId = new mongoose.Types.ObjectId().toString();

            validateObjectId(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        test("should fail invalid id", () => {
            req.params.transactionId = "invalid";

            validateObjectId(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

});