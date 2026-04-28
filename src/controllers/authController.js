const User = require("../models/userModel")

const { validateSignUpData, validateLoginPassword } = require("../middleware/validator");
const { getJWT, getHashPassword } = require("../services/authServices");

const userSignUp = async (req, res) => {
    try {
        validateSignUpData(req);

        const { firstName, lastName, emailId, password, currency } = req.body;
        const passwordHash = await getHashPassword(password);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            currency
        });

        const savedUser = await user.save();

        const token = await getJWT(savedUser);

        // Add the token to cookie and send the response back to the user
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
        });
        res.status(200).json({
            message: `User ${savedUser.firstName} registered successfully`,
            data: savedUser
        });
    }
    catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR: ", err,
        );

        res.status(400).json({
            message: `Failed to signup`,
            error: "VALIDATION_ERROR",
        });
    }
};

const userLogin = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });

        if (!user) throw new Error("New User: Please SignUp");

        // compare pwd with the hash pwd in DB 
        const isPasswordValid = await validateLoginPassword(user, password);
        if (isPasswordValid) {
            const token = await getJWT(user);

            // Add the token to cookie and send the response back to the user
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });

            res.json({
                "message": `${user.firstName} Logged In Successfully`,
                "data": user
            });
        }
        else {
            throw new Error("Invalid credentials");
        }

    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR: ", err.message,
        );
        res.status(400).json({
            message: err.message,
            error: "VALIDATION_ERROR",
        });
    }
};

const userlogout = async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        });
        res.json({
            message: `Logout Successful`,
        });;
    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR: ", err.message,
        );
        res.status(400).json({
            message: `Failed to logout`,
            error: "SERVER_ERROR",
        });
    }
}

module.exports = { userSignUp, userLogin, userlogout }