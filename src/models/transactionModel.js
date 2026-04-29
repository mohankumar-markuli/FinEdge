const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        type: {
            type: String,
            required: true,
            enum: {
                values: ["income", "expense"],
                message: `{VALUE} is not a valid type`
            },
            index: true
        },
        category: {
            type: String,
            required: true,
            enum: {
                values: ["salary", "freelance", "food", "rent", "transport",
                    "shopping", "entertainment", "health", "education", "investment", "other"],
                message: `{VALUE} is not a valid category`
            },
            index: true
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [1, "Amount must be at least 1"]
        },
        merchant: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: 200,
            default: ""
        },
        transactionDate: {
            type: Date,
            required: true,
            default: Date.now,
            index: true
        },
        paymentMethod: {
            type: String,
            enum: {
                values: ["cash", "card", "upi", "bank"],
                message: `{VALUE} is not a valid type - consider from ["cash", "card", "upi", "bank"]`
            },
            default: "cash"
        },

    },
    {
        timestamps: true
    }
);

transactionSchema.index({ userId: 1, transactionDate: -1 });
module.exports = mongoose.model("Transaction", transactionSchema);