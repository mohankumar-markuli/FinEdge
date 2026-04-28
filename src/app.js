require("dotenv").config();
const express = require("express");
const app = express();

const connectDb = require("./config/database");

const { logger } = require("./middleware/logger");

// custom DNS provider then default
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

app.use(logger);
app.use(express.json());

const PORT = process.env.PORT;

const authRouter = require("./routes/authRoutes");

app.use("/", authRouter);

app.get("/health", (req, res) => {
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