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

const validateFields = (keys, allowed, restricted) => {
    const forbidden = keys.filter(k => restricted.has(k));
    if (forbidden.length) {
        throw new Error(`Restricted fields: ${forbidden.join(", ")}`);
    }

    const invalid = keys.filter(k => !allowed.has(k));
    if (invalid.length) {
        throw new Error(`Invalid fields: ${invalid.join(", ")}`);
    }
};

const validateEditUserData = (req) => {
    const ALLOWED_FIELDS = new Set(["firstName", "lastName", "currency"]);
    const RESTRICTED_FIELDS = new Set(["emailId", "password"]);

    const keys = Object.keys(req.body || {});

    if (keys.length === 0) {
        throw new Error("No fields provided for update");
    }
    validateFields(keys, ALLOWED_FIELDS, RESTRICTED_FIELDS);
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

const validateTransactionFields = (req) => {

    // normalization
    if (req.body.type) req.body.type = req.body.type.toLowerCase();
    if (req.body.category) req.body.category = req.body.category.toLowerCase();
    if (req.body.paymentMethod) req.body.paymentMethod = req.body.paymentMethod.toLowerCase();

    // validating each data points
    if (req.body.amount !== undefined) {
        const amount = Number(req.body.amount);

        if (isNaN(amount) || amount <= 0) {
            throw new Error("Amount must be a valid number greater than 0");
        }

        req.body.amount = amount;
    }

    if (typeof req.body.amount === "string" && req.body.amount.trim() === "") {
        throw new Error("Amount cannot be empty");
    }

    const VALID_TYPES = new Set(["income", "expense"]);

    if (req.body.type && !VALID_TYPES.has(req.body.type)) {
        throw new Error("Invalid transaction type");
    }

    const VALID_CATEGORIES = new Set([
        "salary", "freelance", "food", "rent", "transport",
        "shopping", "entertainment", "health", "education", "investment", "other"
    ]);

    if (req.body.category && !VALID_CATEGORIES.has(req.body.category)) {
        throw new Error("Invalid transaction category");
    }

    const VALID_PAYMENT_METHODS = new Set(["cash", "card", "upi", "bank"]);

    if (req.body.paymentMethod && !VALID_PAYMENT_METHODS.has(req.body.paymentMethod)) {
        throw new Error("Invalid transaction payment Method");
    }

    if (req.body.transactionDate) {
        const date = new Date(req.body.transactionDate);
        if (isNaN(date.getTime())) throw new Error("Invalid transaction date");
        if (!date.getTime()) throw new Error("Invalid transaction date");
        req.body.transactionDate = date;
    }

    if (req.body.merchant) {
        req.body.merchant = req.body.merchant.trim();
    }

    if (req.body.description) {
        req.body.description = req.body.description.trim();
    }

}

const validateEditTransactionData = (req) => {
    const ALLOWED_FIELDS = new Set([
        "type",
        "category",
        "amount",
        "merchant",
        "description",
        "transactionDate",
        "paymentMethod"
    ]);

    const RESTRICTED_FIELDS = new Set(["userId"]);

    const keys = Object.keys(req.body || {});

    if (keys.length === 0) {
        throw new Error("No fields provided for update");
    }

    validateFields(keys, ALLOWED_FIELDS, RESTRICTED_FIELDS);

    validateTransactionFields(req);
}

module.exports = {
    validateSignUpData,
    validatePassword,
    validateEditUserData,
    validateChangePassword,
    validateTransactionFields,
    validateEditTransactionData
};