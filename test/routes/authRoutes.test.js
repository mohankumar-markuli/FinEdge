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
    const signupRes = await request(app)
        .post("/api/v1/auth/signup")
        .send({
            firstName: "John",
            lastName: "Doe",
            emailId: "john@test.com",
            password: "Strong@123!",
            currency: "INR"
        });

    expect(signupRes.status).toBe(201);

    // login
    const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({
            emailId: "john@test.com",
            password: "Strong@123!"
        });

    expect(loginRes.status).toBe(200);

    authCookie = loginRes.headers["set-cookie"];
    expect(authCookie).toBeDefined();
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});


// ================= SIGNUP =================
describe("POST /auth/signup", () => {

    test("should create user", async () => {
        const res = await request(app)
            .post("/api/v1/auth/signup")
            .send({
                firstName: "Alice",
                lastName: "Test",
                emailId: "alice@test.com",
                password: "Strong@123!",
                currency: "INR"
            });

        expect(res.status).toBe(201);
    });

    test("should fail duplicate user", async () => {
        await request(app).post("/api/v1/auth/signup").send({
            firstName: "Bob",
            emailId: "dup@test.com",
            password: "Strong@123!",
            currency: "INR"
        });

        const res = await request(app).post("/api/v1/auth/signup").send({
            firstName: "Bob",
            emailId: "dup@test.com",
            password: "Strong@123!",
            currency: "INR"
        });

        expect(res.status).toBe(400);
    });

});


// ================= LOGIN =================
describe("POST /auth/login", () => {

    test("should login successfully", async () => {
        await request(app).post("/api/v1/auth/signup").send({
            firstName: "Login",
            emailId: "login@test.com",
            password: "Strong@123!",
            currency: "INR"
        });

        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                emailId: "login@test.com",
                password: "Strong@123!"
            });

        expect(res.status).toBe(200);
        expect(res.headers["set-cookie"]).toBeDefined();
    });

    test("should fail wrong password", async () => {
        await request(app).post("/api/v1/auth/signup").send({
            firstName: "Wrong",
            emailId: "wrong@test.com",
            password: "Strong@123!",
            currency: "INR"
        });

        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                emailId: "wrong@test.com",
                password: "Wrong@123"
            });

        expect(res.status).toBe(401);
    });

});


// ================= LOGOUT =================
describe("POST /auth/logout", () => {

    test("should logout successfully", async () => {
        const res = await request(app)
            .post("/api/v1/auth/logout")
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Logout Successful");
    });

    test("should fail without auth", async () => {
        const res = await request(app)
            .post("/api/v1/auth/logout");

        expect(res.status).toBe(401);
    });

});