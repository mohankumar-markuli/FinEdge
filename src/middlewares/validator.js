const validator = require("validator");
const bcrypt = require("bcrypt");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password, currency } = req.body;

    if (!firstName) {
        throw new Error("First name is required");
    }

    if (!emailId || !validator.isEmail(emailId)) {
        throw new Error("Valid email is required");
    }

    if (!password || !validator.isStrongPassword(password)) {
        throw new Error("Strong password is required");
    }

    if (!currency) {
        throw new Error("Currency is required");
    }
}

const validatePassword = async (user, userInputPassword) => {
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        userInputPassword,
        passwordHash
    );
    return isPasswordValid;
};

const validateEditUserData = (req) => {
    const allowedFields = [
        "firstName",
        "lastName",
        "currency",
    ];

    const restrictedFields = ["emailId", "password"];

    const keys = Object.keys(req.body);

    if (keys.length === 0) {
        throw new Error("No fields provided for update");
    }

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

const validateChangePassword = async (req) => {
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
        throw new Error("Both old and new passwords are required");
    }

    if (!validator.isStrongPassword(newPassword)) {
        throw new Error("New password must be strong");
    }

    const isOldPasswordValid = await validatePassword(req.user, password);
    if (!isOldPasswordValid) {
        throw new Error("Incorrect current password");
    }

    const isNewPasswordSame = await validatePassword(req.user, newPassword);
    if (isNewPasswordSame) {
        throw new Error("New password cannot be same as old password");
    }
}

const validateEditTransactionData = (req) => {
    const allowedFields = [
        "type",
        "category",
        "amount",
        "merchant",
        "description",
        "transactionDate",
        "paymentMethod"
    ];

    const restrictedFields = ["userId"];

    const keys = Object.keys(req.body);

    if (keys.length === 0) {
        throw new Error("No fields provided for update");
    }

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

    // validating each data points

    if (req.body.type) {
        req.body.type = req.body.type.toLowerCase();
    }

    if (req.body.amount !== undefined && req.body.amount <= 0) {
        throw new Error("Amount must be greater than 0");
    }

    const validTypes = ["income", "expense"];
    if (req.body.type && !validTypes.includes(req.body.type)) {
        throw new Error("Invalid transaction type");
    }

    if (req.body.category) {
        req.body.category = req.body.category.toLowerCase();
    }

    const validCategories = [
        "salary", "freelance", "food", "rent", "transport",
        "shopping", "entertainment", "health", "education", "investment", "other"
    ];

    if (req.body.category && !validCategories.includes(req.body.category)) {
        throw new Error("Invalid transaction category");
    }
}

module.exports = {
    validateSignUpData,
    validatePassword,
    validateEditUserData,
    validateChangePassword,
    validateEditTransactionData
};