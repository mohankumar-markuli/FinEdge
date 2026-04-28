const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getJWT = async (user) => {
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });
    return token;
}

module.exports = { getJWT }