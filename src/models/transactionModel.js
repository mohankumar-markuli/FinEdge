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
            enum: ["income", "expense"],
            index: true
        },
        category: {
            type: String,
            required: true,
            enum: ["salary", "freelance", "food", "rent", "transport", "shopping", "entertainment", "health", "education", "investment", "other"],
            index: true
        },
        amount: {
            type: Number,
            required: true,
            min: 1
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
            enum: ["cash", "card", "upi", "bank"],
            default: "cash"
        },

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);