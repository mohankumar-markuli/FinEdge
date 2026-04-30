const express = require("express");
const analyticsRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const { getSummary, getMonthlyTrends } = require("../controllers/analyticsController");

analyticsRouter.use(userAuth);

analyticsRouter.get('/summary', getSummary);
analyticsRouter.get('/monthly', getMonthlyTrends)

module.exports = analyticsRouter;
