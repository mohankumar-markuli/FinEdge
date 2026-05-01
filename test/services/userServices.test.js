const {
    getUserProfileService,
    updateUserService,
    changePasswordService
} = require("../../src/services/userServices");

const { getHashPassword } = require("../../src/services/authServices");

// Mock dependency
jest.mock("../../src/services/authServices", () => ({
    getHashPassword: jest.fn()
}));

describe("userServices", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ================= getUserProfileService =================
    describe("getUserProfileService", () => {

        // ---- Happy Case ----
        test("should return formatted user profile", () => {
            const user = {
                _id: "123",
                firstName: "John",
                lastName: "Doe",
                emailId: "john@example.com",
                currency: "INR",
                password: "hidden"
            };

            const result = getUserProfileService(user);

            expect(result).toEqual({
                _id: "123",
                firstName: "John",
                lastName: "Doe",
                emailId: "john@example.com",
                currency: "INR"
            });
        });

    });

    // ================= updateUserService =================
    describe("updateUserService", () => {

        // ---- Happy Case ----
        test("should update user fields and return updated data", async () => {
            const user = {
                _id: "123",
                firstName: "Old",
                lastName: "Name",
                emailId: "old@example.com",
                currency: "INR",
                save: jest.fn().mockResolvedValue(true)
            };

            const updateData = {
                firstName: "New",
                lastName: "User"
            };

            const result = await updateUserService(user, updateData);

            expect(user.firstName).toBe("New");
            expect(user.lastName).toBe("User");
            expect(user.save).toHaveBeenCalled();

            expect(result.firstName).toBe("New");
            expect(result.lastName).toBe("User");
        });

        // ---- Edge Case ----
        test("should handle empty updateData", async () => {
            const user = {
                _id: "123",
                firstName: "Test",
                lastName: "User",
                emailId: "test@example.com",
                currency: "INR",
                save: jest.fn().mockResolvedValue(true)
            };

            const result = await updateUserService(user, {});

            expect(user.save).toHaveBeenCalled();
            expect(result.firstName).toBe("Test");
        });

        // ---- Bad Case ----
        test("should throw if save fails", async () => {
            const user = {
                save: jest.fn().mockRejectedValue(new Error("DB error"))
            };

            await expect(updateUserService(user, { firstName: "Fail" }))
                .rejects
                .toThrow("DB error");
        });

    });

    // changePasswordService 
    describe("changePasswordService", () => {

        // Happy Case 
        test("should hash new password and save user", async () => {
            getHashPassword.mockResolvedValue("hashed_password");

            const user = {
                password: "old",
                save: jest.fn().mockResolvedValue(true)
            };

            const result = await changePasswordService(user, "New@123");

            expect(getHashPassword).toHaveBeenCalledWith("New@123");
            expect(user.password).toBe("hashed_password");
            expect(user.save).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        // Bad Case 
        test("should throw if hashing fails", async () => {
            getHashPassword.mockRejectedValue(new Error("hash error"));

            const user = {
                save: jest.fn()
            };

            await expect(changePasswordService(user, "New@123"))
                .rejects
                .toThrow("hash error");
        });

        test("should throw if save fails", async () => {
            getHashPassword.mockResolvedValue("hashed_password");

            const user = {
                save: jest.fn().mockRejectedValue(new Error("DB error"))
            };

            await expect(changePasswordService(user, "New@123"))
                .rejects
                .toThrow("DB error");
        });

    });

});