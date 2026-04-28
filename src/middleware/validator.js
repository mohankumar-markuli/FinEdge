const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password, currency } = req.body;
    if (!firstName) {
        throw new Error("first Name is required");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email not valid");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter strong password");
    }
}

module.exports = {
    validateSignUpData
};