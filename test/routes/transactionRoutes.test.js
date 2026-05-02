process.env.JWT_SECRET_KEY = "testsecret";
process.env.SALT_ROUNDS = "10";

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("..//utils/testApp");

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
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});


// create
describe("POST /transactions", () => {

    test("should create transaction", async () => {
        const res = await request(app)
            .post("/api/v1/transactions")
            .set("Cookie", authCookie)
            .send({
                type: "expense",
                category: "food",
                amount: 100,
                paymentMethod: "upi",
                transactionDate: "2026-01-01"
            });

        expect(res.status).toBe(201);
    });

    test("should fail without auth", async () => {
        const res = await request(app)
            .post("/api/v1/transactions")
            .send({});

        expect(res.status).toBe(401);
    });

});


// get all
describe("GET /transactions", () => {

    test("should fetch transactions", async () => {
        const res = await request(app)
            .get("/api/v1/transactions")
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
    });

});


// recent
describe("GET /transactions/recent", () => {

    test("should fetch recent transactions", async () => {
        const res = await request(app)
            .get("/api/v1/transactions/recent")
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
    });

});


// get by id
describe("GET /transactions/:id", () => {

    test("should fetch transaction by id", async () => {
        const createRes = await request(app)
            .post("/api/v1/transactions")
            .set("Cookie", authCookie)
            .send({
                type: "expense",
                category: "food",
                amount: 200,
                paymentMethod: "upi",
                transactionDate: "2026-01-01"
            });

        const id = createRes.body.data._id;

        const res = await request(app)
            .get(`/api/v1/transactions/${id}`)
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
    });

    test("should fail invalid objectId", async () => {
        const res = await request(app)
            .get("/api/v1/transactions/invalid-id")
            .set("Cookie", authCookie);

        expect(res.status).toBeGreaterThanOrEqual(400);
    });

});


// update
describe("PATCH /transactions/:id", () => {

    test("should update transaction", async () => {
        const createRes = await request(app)
            .post("/api/v1/transactions")
            .set("Cookie", authCookie)
            .send({
                type: "expense",
                category: "food",
                amount: 200,
                paymentMethod: "upi",
                transactionDate: "2026-01-01"
            });

        const id = createRes.body.data._id;

        const res = await request(app)
            .patch(`/api/v1/transactions/${id}`)
            .set("Cookie", authCookie)
            .send({
                amount: 500
            });

        expect(res.status).toBe(200);
    });

});


// delete
describe("DELETE /transactions/:id", () => {

    test("should delete transaction", async () => {
        const createRes = await request(app)
            .post("/api/v1/transactions")
            .set("Cookie", authCookie)
            .send({
                type: "expense",
                category: "food",
                amount: 200,
                paymentMethod: "upi",
                transactionDate: "2026-01-01"
            });

        const id = createRes.body.data._id;

        const res = await request(app)
            .delete(`/api/v1/transactions/${id}`)
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
    });

});