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
        firstName: "User",
        emailId: "user@test.com",
        password: "Strong@123!",
        currency: "INR"
    });

    // login
    const loginRes = await request(app).post("/api/v1/auth/login").send({
        emailId: "user@test.com",
        password: "Strong@123!"
    });

    authCookie = loginRes.headers["set-cookie"];

    // create some transactions for analytics
    await request(app)
        .post("/api/v1/transactions")
        .set("Cookie", authCookie)
        .send({
            type: "income",
            category: "salary",
            amount: 1000,
            paymentMethod: "bank",
            transactionDate: "2026-01-01"
        });

    await request(app)
        .post("/api/v1/transactions")
        .set("Cookie", authCookie)
        .send({
            type: "expense",
            category: "food",
            amount: 200,
            paymentMethod: "upi",
            transactionDate: "2026-01-02"
        });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});


// summary
describe("GET /analytics/summary", () => {

    test("should return summary", async () => {
        const res = await request(app)
            .get("/api/v1/analytics/summary")
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
        expect(res.body.data.totalIncome).toBeDefined();
        expect(res.body.data.totalExpense).toBeDefined();
    });

    test("should fail without auth", async () => {
        const res = await request(app)
            .get("/api/v1/analytics/summary");

        expect(res.status).toBe(401);
    });

});


// monthly
describe("GET /analytics/trends/monthly", () => {

    test("should return monthly trends", async () => {
        const res = await request(app)
            .get("/api/v1/analytics/trends/monthly")
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

});


// yearly
describe("GET /analytics/trends/yearly", () => {

    test("should return yearly trends", async () => {
        const res = await request(app)
            .get("/api/v1/analytics/trends/yearly")
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

});