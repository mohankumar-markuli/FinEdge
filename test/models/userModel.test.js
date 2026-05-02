const User = require("../../src/models/userModel");

describe("User Model", () => {

    // email
    test("should fail invalid email", () => {
        const user = new User({
            firstName: "Test",
            emailId: "invalid",
            password: "Strong@123!",
            currency: "INR"
        });

        const err = user.validateSync();

        expect(err).toBeDefined();
        expect(err.errors.emailId).toBeDefined();
    });

    // password
    test("should fail weak password", () => {
        const user = new User({
            firstName: "Test",
            emailId: "test@test.com",
            password: "123", // weak password
            currency: "INR"
        });

        const err = user.validateSync();

        expect(err).toBeDefined();
        expect(err.errors.password).toBeDefined();
    });

    // currency
    test("should fail invalid currency", () => {
        const user = new User({
            firstName: "Test",
            emailId: "test@test.com",
            password: "Strong@123!",
            currency: "ABC"
        });

        const err = user.validateSync();

        expect(err).toBeDefined();
        expect(err.errors.currency).toBeDefined();
    });

    test("should fail unsupported currency", () => {
        const user = new User({
            firstName: "Test",
            emailId: "test@test.com",
            password: "Strong@123!",
            currency: "EUR"
        });

        const err = user.validateSync();

        expect(err).toBeDefined();
        expect(err.errors.currency).toBeDefined();
    });

    // success
    test("should pass valid user", () => {
        const user = new User({
            firstName: "Test",
            lastName: "User",
            emailId: "test@test.com",
            password: "Strong@123!",
            currency: "INR"
        });

        const err = user.validateSync();

        expect(err).toBeUndefined();
    });

});