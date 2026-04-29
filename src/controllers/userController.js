
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

module.exports = { viewUser };