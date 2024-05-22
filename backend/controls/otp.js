const Otp = require("../model/otp");
const userProfile = require("../model/user");
const { verifyHashedData } = require("../utilities/hashData");


const verifyOtp = async (email, otp ) => {
    try {
        const matchedOtpRecord = await Otp.findOne({ email, });
        if (!matchedOtpRecord) {
            return { status: 404, message: "User not Founded!" };
        }
        else if (matchedOtpRecord.expiresAt < Date.now()) {
            await Otp.deleteOne({ email });
            return { status: 408, message: "Request Timeout" };
        }
        else {
            const hashedOtp = matchedOtpRecord.Otp;
            const validOtp = await verifyHashedData(otp, hashedOtp);
            if (validOtp) {
                const verifyStatus = await userProfile.findOneAndUpdate({email},{$set:{emailVerified: true}});
                if(verifyStatus){ return {status: 200, message:"UserProfile is verified!"}}
            }
            else{
                return {status:304, message: "UserProfile is not verified!"}
            }
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
};

const forgotPasswordOTP = async(email,otp) =>{
    try {
        const matchedOtpRecord = await Otp.findOne({ email, });
        if (!matchedOtpRecord) {
            return { status: 404, message: "User not Founded!" };
        }
        else if (matchedOtpRecord.expiresAt < Date.now()) {
            await Otp.deleteOne({ email });
            return { status: 408, message: "Request Timeout" };
        }
        else {
            const hashedOtp = matchedOtpRecord.Otp;
            const validOtp = await verifyHashedData(otp, hashedOtp);
            if (validOtp) {
               return {status:200, message: "User is verified!  "}
            }
            else{
                return {status:304, message: "UserProfile is not verified!"}
            }
        }

    } catch (error) {
        console.log(error);
        throw error;
    }

}

module.exports = { verifyOtp, forgotPasswordOTP };