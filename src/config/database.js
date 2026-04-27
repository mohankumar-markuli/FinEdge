const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

// connect to a clusetr
const connectDb = async () => {
    await mongoose.connect(MONGODB_URI);
};

module.exports = connectDb;