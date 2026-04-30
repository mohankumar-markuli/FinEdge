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
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const analyticsRouter = require('./routes/analyticsRoutes');

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/analytics", analyticsRouter);

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

app.use(errorHandler);

async function startDependencies() {
    try {
        console.log("Starting dependencies...");

        // connect to database
        await connectDb();
        console.log("Database connected");

        // start the server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("Startup failed:", err.message);
        process.exit(1);
    }
}

startDependencies();