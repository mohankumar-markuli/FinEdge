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
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe("Auth Routes", () => {

    test("should signup", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            firstName: "Test",
            emailId: "test@test.com",
            password: "StrongPass@123",
            currency: "INR"
        });

        expect(res.status).toBe(201);
    });

    test("should login", async () => {
        await request(app).post("/api/v1/auth/signup").send({
            firstName: "Login",
            emailId: "login@test.com",
            password: "StrongPass@123",
            currency: "INR"
        });

        const res = await request(app).post("/api/v1/auth/login").send({
            emailId: "login@test.com",
            password: "StrongPass@123"
        });

        authCookie = res.headers["set-cookie"];

        expect(res.status).toBe(200);
    });

});