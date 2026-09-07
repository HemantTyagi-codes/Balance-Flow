const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    upiId: {
        type: String,
        required: true,
        unique: true,
    },
    balance:{
        type: Number,
        default: 0,
    },
    mpin: {
        type: String,
        required: true,
    }},
    {timestamps: true});

module.exports = mongoose.model("User", userSchema);