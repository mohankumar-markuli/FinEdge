const validator = require("validator");
const bcrypt = require("bcrypt");

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

const validateLoginPassword = async (user, userInputPassword) => {
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        userInputPassword,
        passwordHash
    );
    return isPasswordValid;
};

module.exports = {
    validateSignUpData,
    validateLoginPassword
};