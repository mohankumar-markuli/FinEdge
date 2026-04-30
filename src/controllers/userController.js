const { validateEditUserData, validateChangePassword } = require("../middlewares/validator")
const { getHashPassword } = require("../services/authServices");

const viewUser = async (req, res, next) => {
    try {
        const user = req.user;
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
            currency: user.currency
        };

        res.status(200).json({
            message: `User ${req.user.firstName} fetched Successfully`,
            data: userResponse
        });

    } catch (err) {
        next(err);
    }
}

const editUser = async (req, res, next) => {
    try {
        await validateEditUserData(req);

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save();

        const userResponse = {
            _id: loggedInUser._id,
            firstName: loggedInUser.firstName,
            lastName: loggedInUser.lastName,
            emailId: loggedInUser.emailId,
            currency: loggedInUser.currency
        };

        res.status(200).json({
            message: `Profile Updated Successfully`,
            data: userResponse
        });
    }
    catch (err) {
        next(err);
    }
}

const changePassword = async (req, res, next) => {
    try {
        await validateChangePassword(req);

        const loggedInUser = req.user;
        const newPasswordHash = await getHashPassword(req.body.newPassword);

        loggedInUser['password'] = newPasswordHash;
        await loggedInUser.save();

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
        });

        res.status(200).json({
            message: `Password Changed Successfully`,
        });

    } catch (err) {
        next(err);
    }
}

module.exports = { viewUser, editUser, changePassword };