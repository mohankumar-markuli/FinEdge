const User = require("../models/userModel");

const viewUser = async (req, res) => {
    try {

        const user = await User.find({});

        res.status(200).json({
            message: `User fetched Successfully`,
            data: user
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

module.exports = { viewUser };