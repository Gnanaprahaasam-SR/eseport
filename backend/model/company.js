const mongoose = require("mongoose");

const CompanyInfoSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    corporateEmail: { type: String, }, 
    accountType: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String,},
    streetAddress: { type: String },
    postalCode: { type: String }, 
    website: { type: String },
    bankDetails: { type: String },
    about: { type: String },
    companyId: { type: String, unique: true, required: true } 
}, { timestamps: true });


CompanyInfoSchema.pre("save", async function (next) {
    if (this.isNew) {
        
        if (!this.corporateEmail) {this.corporateEmail = ""}
        if (!this.city) {this.city = ""}
        if (!this.streetAddress) {this.streetAddress = ""}
        if (!this.postalCode) {this.postalCode = ""}
        if (!this.website) {this.website = ""}
        if (!this.bankDetails) {this.bankDetails = ""}
        if (!this.about) {this.about = ""}
    }
    next();
});

const companyDetail = mongoose.model("CompanyDetail", CompanyInfoSchema); 
module.exports = companyDetail;
