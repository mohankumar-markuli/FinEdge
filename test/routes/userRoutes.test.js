process.env.JWT_SECRET_KEY = "testsecret";
process.env.SALT_ROUNDS = "10";

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../utils/testApp");

let mongoServer;
let authCookie;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // signup
    await request(app).post("/api/v1/auth/signup").send({
        firstName: "John",
        lastName: "Doe",
        emailId: "john@test.com",
        password: "Strong@123!",
        currency: "INR"
    });

    // login
    const loginRes = await request(app).post("/api/v1/auth/login").send({
        emailId: "john@test.com",
        password: "Strong@123!"
    });

    authCookie = loginRes.headers["set-cookie"];
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

// get profile
describe("GET /users/profile", () => {

    test("should fetch user profile", async () => {
        const res = await request(app)
            .get("/api/v1/users/profile")
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
        expect(res.body.data.emailId).toBe("john@test.com");
    });

    test("should fail without auth", async () => {
        const res = await request(app)
            .get("/api/v1/users/profile");

        expect(res.status).toBe(401);
    });

});

// update profile
describe("PATCH /users/profile", () => {

    test("should update profile", async () => {
        const res = await request(app)
            .patch("/api/v1/users/profile")
            .set("Cookie", authCookie)
            .send({
                firstName: "Updated",
                currency: "INR"
            });

        expect(res.status).toBe(200);
        expect(res.body.data.firstName).toBe("Updated");
    });

    test("should fail for restricted field", async () => {
        const res = await request(app)
            .patch("/api/v1/users/profile")
            .set("Cookie", authCookie)
            .send({
                password: "123"
            });

        expect(res.status).toBeGreaterThanOrEqual(400);
    });

});

// change password
describe("PATCH /users/password", () => {

    test("should change password successfully", async () => {
        const res = await request(app)
            .patch("/api/v1/users/password")
            .set("Cookie", authCookie)
            .send({
                password: "Strong@123!",
                newPassword: "NewStrong@123!"
            });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Password Changed Successfully");
    });

    test("should fail for wrong current password", async () => {
        const res = await request(app)
            .patch("/api/v1/users/password")
            .set("Cookie", authCookie)
            .send({
                password: "Wrong@123",
                newPassword: "NewStrong@123!"
            });

        expect(res.status).toBeGreaterThanOrEqual(400);
    });

    test("should fail without auth", async () => {
        const res = await request(app)
            .patch("/api/v1/users/password")
            .send({
                password: "Strong@123!",
                newPassword: "NewStrong@123!"
            });

        expect(res.status).toBe(401);
    });

});