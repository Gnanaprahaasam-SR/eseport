const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    Otp: {type: String,},
    createdAt: {type: Date,},
    expiresAt: {type: Date,},
});

const Otp = mongoose.model("otp",OtpSchema);

module.exports = Otp;