const express = require('express');
const Otp = require('../model/otp');
const router = express.Router();
const sendEmail = require('../utilities/sendEmail');
const { hashData, verifyHashedData } = require('../utilities/hashData');
const { verifyOtp, forgotPasswordOTP } = require('../controls/otp');
const userProfile = require('../model/user');
const { createToken } = require('../utilities/createToken');
require("dotenv").config();
const jwt = require("jsonwebtoken");
const companyDetail = require('../model/company');
const session = require('express-session');

router.post("/signIn", async (req, res) => {
    try {
        const { email, password } = req.body;
        const fetchUser = await userProfile.findOne({ email });

        if (fetchUser) {
            const verifyPassword = await verifyHashedData(password, fetchUser.password);
            if (verifyPassword) {

                const newToken = await createToken(email);
                if (newToken) {
                    return res.cookie("usertoken", newToken, {
                        // Note: 'secure: true' is used for HTTPS, remove in development without HTTPS
                        // secure: true,
                        httpOnly: true, // Ensures that the cookie is only accessible through the HTTP(S) protocol
                        sameSite: 'strict', // Provides a level of CSRF protection
                    }).status(200).json({ status: 200, data: newToken, message: "User login successfully" });
                }
                else {
                    return res.status(424).json({ status: 424, message: "Failed to create a token" });
                }
            } else {
                return res.status(406).json({ status: 406, message: "Invalid Password" });
            }
        } else {
            res.status(404).json({ status: 404, message: "User not founded!" });
        }

    } catch (error) {
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        console.log(error);
    }

});

router.use(session({
    secret: process.env.TOKEN_KEY, // Change this to your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

router.post("/tokenVerification", async (req, res) => {
    try {
        const { userToken } = req.body;
        // console.log(userToken)
        jwt.verify(userToken, process.env.TOKEN_KEY, async (error, decode) => {
            if (error) {
                return res.status(401).json({ status: 401, message: "Invalid Token provided" });
            }
            else {
                const verifiedUser = await userProfile.findOne({ email: decode.email });
                if (verifiedUser ) {
                    req.session.userData= verifiedUser;
                    return res.status(200).json({ status: 200, data: verifiedUser });
                } else {
                    return res.status(401).json({ status: 401, message: "Invalid Token provided" });
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        console.log(error);
    }
});

router.post("/signUp", async (req, res) => {
    // console.log(req.body);
    try {
        const { firstName, lastName, email, password, companyName, country, phoneNumber, accountType } = req.body;
        const hashPassword = await hashData(password);

        let newId, existingValue;
        do {
            newId = Math.floor(100000 + Math.random() * 900000);
            existingValue = await userProfile.findOne({ profileId: newId });
        } while (existingValue);

        const subject = "Verifiy Your Profile ";
        const content = `Please use the verification code below to complete your registration and gain access to our shipping services.`;

        const existingUser = await userProfile.findOne({ email });
        console.log(existingUser);
        if (existingUser && existingUser.emailVerified) {
            res.status(302).json({ status: 302, message: "User is already exist!" });
        }
        else {
            if (!existingUser) {

                const createUser = new userProfile({ firstName, lastName, email, password: hashPassword, phoneNumber, country, profileId: newId });
                const userStatus = await createUser.save();

                const createCompany = new companyDetail({ companyName, accountType, country, companyId: newId });
                const companyStatus = await createCompany.save();
                // console.log(companyStatus, userStatus);

                if (userStatus && companyStatus) {
                    const verifyData = await Otp.deleteOne({ email });
                    const otpResponse = await sendEmail(email, duration = 15, subject, content);
                    // console.log(verifyData, otpResponse);

                    if (otpResponse) {
                        return res.status(200).json({ status: 200, data: userStatus, message: "UserProfile is created!" });
                    } else {
                        return res.status(422).json({ status: 422, message: "Unprocessable content" });
                    }
                }
                else {
                    res.status(424).json({ status: 424, message: "Failed to create user!" });
                }
            } else {
                const verifyData = await Otp.deleteOne({ email });
                const otpResponse = await sendEmail(email, duration = 15, subject, content);
                // console.log(verifyData, otpResponse);

                if (otpResponse) {
                    return res.status(200).json({ status: 200, data: existingUser, message: "UserProfile is created!" });
                } else {
                    return res.status(422).json({ status: 422, message: "Unprocessable content" });
                }
            }
        }

    } catch (error) {
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        console.log(error);
    }

});


router.post("/resendOtp", async (req, res) => {
    try {
        const { email } = req.body;
        console.log(req.body)
        const existingUser = await userProfile.findOne({ email });
        if (existingUser) {
            const subject = "Verifiy Your Profile ";
            const content = `Please use the verification code below to complete your registration and gain access to our shipping services. `;
            const verifyData = await Otp.deleteOne({ email });
            const otpResponse = await sendEmail(email, duration = 15, subject, content);
            // console.log(verifyData, otpResponse);

            if (otpResponse) {
                return res.status(200).json({ status: 200, data: existingUser, message: "OTP send successfully !" });
            } else {
                return res.status(422).json({ status: 422, message: "Unprocessable content" });
            }
        } else {
            res.status(424).json({ status: 424, message: "Failed to resend OTP!" });
        }

    } catch (error) {
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        console.log(error);
    }
});

router.post("/userVerification", async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(req.body)
        const validOtp = await verifyOtp(email, otp);
        return res.status(validOtp.status).json(validOtp);
    } catch (error) {
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        console.log(error);
    }
});


router.post("/forgetPassword", async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await userProfile.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ status: 404, message: "User is Not Found!" });
        }
        else {
            const subject = "Forgot Password";
            const content = `Dear ${existingUser.firstName + " " + existingUser.lastName}, please update your password by using given code below`;
            const verifyData = await Otp.deleteOne({ email });
            const otpResponse = await sendEmail(email, duration = 15, subject, content);
            console.log(verifyData, otpResponse);

            if (otpResponse) {
                return res.status(200).json({ status: 200, message: "Please check your Mail!" });
            } else {
                return res.status(422).json({ status: 422, message: "Unprocessable content" });
            }
        }
    }
    catch (error) {
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        console.log(error);
    }
});

router.post("/forgetOTPVerify", async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(req.body)
        const validOtp = await forgotPasswordOTP(email, otp);
        console.log(validOtp)
        if (validOtp.status === 200) {
            return res.redirect(process.env.CLIENT_URL);
        }
        return res.status(validOtp.status).json(validOtp);
    } catch (error) {
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        console.log(error);
    }

});

router.post("/resetpassword", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const hashpassword = await hashData(password);
        const userVerification = await userProfile.findOneAndUpdate({ email }, { $set: { password: hashpassword } });
        if (userVerification) {
            return res.status(200).json({ status: 200, message: "password reset successfully" });
        }
        else {
            return res.status(406).json({ status: 424, message: "failed to update a password" });
        }
    }
    catch (error) {
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        console.log(error);
    }
})


module.exports = router;