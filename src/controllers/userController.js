const { validateEditUserData, validateChangePassword } = require("../middlewares/validator")
const { getHashPassword } = require("../services/authServices");

const viewUser = async (req, res) => {
    try {
        console.log(req.user);
        res.status(200).json({
            message: `User ${req.user.firstName} fetched Successfully`,
            data: req.user
        });

    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR:", err.message,
        );

        res.status(400).json({
            message: `Failed to fetch user data`,
            error: "NOT_FOUND",
        });
    }
}

const editUser = async (req, res) => {
    try {
        await validateEditUserData(req);

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });
        await loggedInUser.save();

        res.status(200).json({
            message: `Profile Updated Successfully`,
            data: loggedInUser
        });
    }
    catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR:", err.message
        );

        res.status(400).json({
            message: `Failed to update profile`,
            error: "BAD_REQUEST",
        });
    }
}

const changePassword = async (req, res) => {
    try {
        await validateChangePassword(req, res);

        const loggedInUser = req.user;
        const newPasswordHash = await getHashPassword(req.body.newPassword);

        loggedInUser['password'] = newPasswordHash;
        await loggedInUser.save();

        res.cookie("token", null, {
            expires: new Date(Date.now()),
        });

        res.status(200).json({
            message: `Password Changed Successfully`,
        });

    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR:", err.message,
        );

        res.status(400).json({
            message: `Failed to change password`,
            error: "VALIDATION_ERROR",
        });
    }
}

module.exports = { viewUser, editUser, changePassword };