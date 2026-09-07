const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        billerName: {
            type: String,
            default: null
        },

        billerUpiId: {
            type: String,
            default: null
        },

        amount: {
            type: Number,
            required: true
        },

        type: {
            type: String,
            enum: ["TRANSFER", "RECHARGE", "BILL_PAYMENT", "QR_PAYMENT", "ADD_MONEY"],
            required: true
        },

        status: {
            type: String,
            enum: ["SUCCESS", "FAILED", "PENDING"],
            default: "SUCCESS"
        },

        note: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);