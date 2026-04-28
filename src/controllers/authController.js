const User = require("../models/userModel")
const bcrypt = require("bcrypt");

const { validateSignUpData } = require("../middleware/validator");

const userSignUp = async (req, res) => {
    try {
        validateSignUpData(req);

        const { firstName, lastName, emailId, password, currency } = req.body;
        const saltRounds = parseInt(process.env.SALT_ROUNDS);
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            currency
        });

        const savedUser = await user.save();

        res.status(200).json({
            message: `User ${savedUser.firstName} registered successfully`,
            data: savedUser
        });
    }
    catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR: ", err.message,
        );

        res.status(400).json({
            message: `Failed to signup`,
            error: "VALIDATION_ERROR",
        });
    }
};


module.exports = { userSignUp }