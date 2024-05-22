const jwt = require("jsonwebtoken");
const userProfile = require("../model/user");
require("dotenv").config();

const createToken = async (tokenData) => {
    const generateToken = jwt.sign({ email: tokenData }, process.env.TOKEN_KEY, { expiresIn: "1d" });
    const updatedUser = await userProfile.findOneAndUpdate({ email: tokenData }, { $set: { token: generateToken } });
    // console.log(updatedUser)
    if (updatedUser) {
        console.log("Token generated and user profile updated successfully:", generateToken);
        return generateToken;
    }
    else {
        console.error("Failed to update user profile with token");
        return false;
    }
}



module.exports = { createToken };