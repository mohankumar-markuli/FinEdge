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

const validateEditUserData = async (req) => {
    const allowedFields = [
        "firstName",
        "lastName",
        "currency",
    ];

    const restrictedFields = ["emailId", "password"];

    const keys = Object.keys(req.body);

    const invalidFields = keys.filter(
        (field) => !allowedFields.includes(field) && !restrictedFields.includes(field)
    );

    const forbiddenFields = keys.filter(
        (field) => restrictedFields.includes(field)
    );

    if (forbiddenFields.length > 0) {
        throw new Error(
            `Cannot update restricted fields: ${forbiddenFields.join(", ")}`
        );
    }

    if (invalidFields.length > 0) {
        throw new Error(
            `Invalid fields provided: ${invalidFields.join(", ")}`
        );
    }
};

module.exports = {
    validateSignUpData,
    validateLoginPassword,
    validateEditUserData
};