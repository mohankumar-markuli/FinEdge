const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { getHashPassword, getJWT } = require("../../src/services/authServices");

// Mock external libraries
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("authServices", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.SALT_ROUNDS = "10";
        process.env.JWT_SECRET_KEY = "test_secret";
    });

    // getHashPassword 
    describe("getHashPassword", () => {

        test("should hash password correctly", async () => {
            bcrypt.hash.mockResolvedValue("hashed_password");

            const result = await getHashPassword("plain123");

            expect(bcrypt.hash).toHaveBeenCalledWith("plain123", 10);
            expect(result).toBe("hashed_password");
        });

        test("should throw error if bcrypt fails", async () => {
            bcrypt.hash.mockRejectedValue(new Error("hash failed"));

            await expect(getHashPassword("plain123"))
                .rejects
                .toThrow("hash failed");
        });

    });

    //  getJWT 
    describe("getJWT", () => {


        test("should generate JWT token correctly", async () => {
            jwt.sign.mockReturnValue("mock_token");

            const user = { _id: "user123" };

            const token = await getJWT(user);

            expect(jwt.sign).toHaveBeenCalledWith(
                { _id: "user123" },
                "test_secret",
                { expiresIn: "7d" }
            );

            expect(token).toBe("mock_token");
        });

        test("should throw error if jwt.sign fails", async () => {
            jwt.sign.mockImplementation(() => {
                throw new Error("jwt failed");
            });

            const user = { _id: "user123" };

            await expect(getJWT(user))
                .rejects
                .toThrow("jwt failed");
        });

    });

});