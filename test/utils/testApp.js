require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const { errorHandler } = require("../../src/middlewares/errorHandler");

// routes
const authRouter = require("../../src/routes/authRoutes");
const userRouter = require("../../src/routes/userRoutes");
const transactionRouter = require("../../src/routes/transactionRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

// mount only what we need for this test
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/transactions", transactionRouter);

// error handler
app.use(errorHandler);

module.exports = app;