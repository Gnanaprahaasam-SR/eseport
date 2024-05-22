const mongoose = require("mongoose");
// const generateUniqueId = require("generate-unique-id");

const UserProfileSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phoneNumber: { type: String, required: true }, 
    country: { type: String, required: true },
    city: { type: String },
    department: { type: String },
    jobTitle: { type: String },
    languageSpoken: { type: String },
    profileId: { type: String, unique: true, required: true }, 
    password: { type: String, required: true },
    emailVerified: {type: Boolean, default: false},
    phoneNumberVerified: {type: Boolean, default: false},
    token: { type: String }
}, { timestamps: true });

UserProfileSchema.pre("save", async function (next) {
    if (this.isNew) {
        
        if (!this.city) {this.city = ""}
        if (!this.department) {this.department = ""}
        if (!this.jobTitle) {this.jobTitle = ""}
        if (!this.languageSpoken) {this.languageSpoken = ""}
        if (!this.token) {this.token = ""}
        if (!this.emailVerified) {this.emailVerified = false }
        if (!this.phoneNumberVerified) {this.phoneNumberVerified = false }
        
    }
    next();
});

const userProfile = mongoose.model("UserProfile", UserProfileSchema); 
module.exports = userProfile;
