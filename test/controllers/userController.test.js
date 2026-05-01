const {
    viewUser,
    editUser,
    changePassword
} = require("../../src/controllers/userController");

const {
    getUserProfileService,
    updateUserService,
    changePasswordService
} = require("../../src/services/userServices");

// ---- MOCK SERVICES ----
jest.mock("../../src/services/userServices");

describe("User Controller Unit Tests", () => {

    let req, res, next;

    beforeEach(() => {
        req = {
            user: {
                _id: "123",
                firstName: "Test",
                lastName: "User",
                emailId: "test@example.com",
                currency: "INR"
            },
            body: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            clearCookie: jest.fn()
        };

        next = jest.fn();

        jest.clearAllMocks();
    });

    // ================= VIEW USER =================
    describe("viewUser", () => {

        test("should return user profile successfully", async () => {
            const mockData = {
                _id: "123",
                firstName: "Test",
                emailId: "test@example.com",
                currency: "INR"
            };

            getUserProfileService.mockReturnValue(mockData);

            await viewUser(req, res, next);

            expect(getUserProfileService).toHaveBeenCalledWith(req.user);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: `User Test fetched successfully`,
                data: mockData
            });
        });

        test("should call next on error", async () => {
            getUserProfileService.mockImplementation(() => {
                throw new Error("Error");
            });

            await viewUser(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // ================= EDIT USER =================
    describe("editUser", () => {

        test("should update user successfully", async () => {
            req.body = { firstName: "Updated" };

            const updatedData = {
                _id: "123",
                firstName: "Updated",
                emailId: "test@example.com",
                currency: "INR"
            };

            updateUserService.mockResolvedValue(updatedData);

            await editUser(req, res, next);

            expect(updateUserService).toHaveBeenCalledWith(req.user, req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Profile Updated Successfully",
                data: updatedData
            });
        });

        test("should call next on error", async () => {
            updateUserService.mockRejectedValue(new Error("Update failed"));

            await editUser(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    // ================= CHANGE PASSWORD =================
    describe("changePassword", () => {

        test("should change password successfully", async () => {
            req.body = { newPassword: "New@123" };

            changePasswordService.mockResolvedValue(true);

            await changePassword(req, res, next);

            expect(changePasswordService).toHaveBeenCalledWith(
                req.user,
                "New@123"
            );

            expect(res.clearCookie).toHaveBeenCalledWith("token", {
                httpOnly: true,
                sameSite: "strict"
            });

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Password Changed Successfully"
            });
        });

        test("should call next on error", async () => {
            changePasswordService.mockRejectedValue(new Error("Failed"));

            await changePassword(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

});