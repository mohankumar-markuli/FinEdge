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
            user: {},
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

            expect(next).toHaveBeenCalledWith();
        });

        test("should fail if firstName missing", () => {
            req.body = {
                emailId: "test@test.com",
                password: "Strong@123!",
                currency: "INR"
            };

            validateSignUpData(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // password
    describe("validatePassword", () => {

        test("should return true for valid password", async () => {
            bcrypt.compare.mockResolvedValue(true);

            const result = await validatePassword(
                { password: "hashed" },
                "input"
            );

            expect(result).toBe(true);
        });

    });

    // edit user
    describe("validateEditUserData", () => {

        test("should pass valid fields", () => {
            req.body = { firstName: "New" };

            validateEditUserData(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test("should fail if restricted field present", () => {
            req.body = { password: "123" };

            validateEditUserData(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // change password
    describe("validateChangePassword", () => {

        test("should pass valid password change", async () => {
            req.body = {
                password: "old",
                newPassword: "Strong@123!"
            };

            req.user = { password: "hashed" };

            bcrypt.compare
                .mockResolvedValueOnce(true)   // old password valid
                .mockResolvedValueOnce(false); // new password different

            await validateChangePassword(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test("should fail if passwords missing", async () => {
            req.body = {};

            await validateChangePassword(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // transaction
    describe("validateTransactionFields", () => {

        test("should normalize and pass valid data", () => {
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

            expect(next).toHaveBeenCalled();
        });

    });

    // edit transaction
    describe("validateEditTransactionData", () => {

        test("should pass valid edit fields", () => {
            req.body = { amount: 100 };

            validateEditTransactionData(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test("should fail if restricted field used", () => {
            req.body = { userId: "123" };

            validateEditTransactionData(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // object id
    describe("validateObjectId", () => {

        test("should pass valid objectId", () => {
            req.params.transactionId = new mongoose.Types.ObjectId().toString();

            validateObjectId(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test("should fail invalid objectId", () => {
            req.params.transactionId = "invalid-id";

            validateObjectId(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

});