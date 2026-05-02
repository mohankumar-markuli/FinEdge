jest.setTimeout(20000);

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

    await mongoose.connect(mongoServer.getUri(), {
        dbName: "test-db"
    });

    await request(app).post("/api/v1/auth/signup").send({
        firstName: "User",
        emailId: "user@test.com",
        password: "StrongPass@123",
        currency: "INR"
    });

    const login = await request(app).post("/api/v1/auth/login").send({
        emailId: "user@test.com",
        password: "StrongPass@123"
    });

    authCookie = login.headers["set-cookie"];
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe("Transaction Routes", () => {

    test("should create transaction", async () => {
        const res = await request(app)
            .post("/api/v1/transactions")
            .set("Cookie", authCookie)
            .send({
                type: "expense",
                category: "food",
                amount: 100,
                paymentMethod: "upi"
            });

        expect(res.status).toBe(201);
    });

});