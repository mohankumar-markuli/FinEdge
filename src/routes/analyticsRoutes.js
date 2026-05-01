const express = require("express");
const analyticsRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const { getSummary, getMonthlyTrends, getYearlyTrends } = require("../controllers/analyticsController");

analyticsRouter.use(userAuth);

analyticsRouter.get('/summary', getSummary);
analyticsRouter.get('/trends/monthly', getMonthlyTrends);
analyticsRouter.get("/trends/yearly", getYearlyTrends);

module.exports = analyticsRouter;
