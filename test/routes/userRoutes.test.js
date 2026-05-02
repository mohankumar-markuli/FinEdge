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

describe("User Routes", () => {

    test("should get profile", async () => {
        const res = await request(app)
            .get("/api/v1/users/profile")
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
    });

});