require("dotenv").config();
const express = require("express");
const app = express();

const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");

const { logger } = require('./middlewares/logger');
const { errorHandler } = require("./middlewares/errorHandler");

// custom DNS provider then default
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

app.use(logger);
app.use(errorHandler);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const analyticsRouter = require('./utils/analytics');

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/analytics", analyticsRouter);

app.get("/api/health", (req, res) => {
    try {
        res.json({
            status: "OK",
            message: "Server is running",
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR: ", err.message,
        );

        res.status(400).json({
            message: `Health Check Failed`,
            error: "INTERNAL_SERVER_ERROR",
        });
    }
});

async function startDependencies() {
    try {
        console.log("Starting my Server dependencies...");

        // connect to database
        await connectDb();
        console.log("   - DATABASE connection established...");

        // start the server
        app.listen(PORT, () => {
            console.log("   - SERVER is up and running...");
            console.log("All dependencies are up and running...");
        });
    }
    catch (err) {
        console.error(err)
        console.log("database connection failed check network or serverIP");
    }
}

startDependencies();