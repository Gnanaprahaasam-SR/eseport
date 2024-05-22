
const nodemailer = require('nodemailer');
require("dotenv").config();
const { hashData } = require('./hashData');
const Otp = require('../model/otp');


const sendEmail = async (email, duration, subject, content) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        service: "gmail",
        secure: true,
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.EMAIL_PASS,
        },
    });

    transporter.verify((error, success) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Ready for messages");
            console.log(success);
        }
    });
    try {
        const generatedOtp = Math.floor(1000 + Math.random() * 9000);
        // send email
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: `${subject}`,
            html: ` <b>Dear Valued Member,</b>
              <br></br>
            <p>Welcome aboard! We're thrilled to have you join Eseport as a valued member of our global shipping community. Thank you for choosing us to handle your freight forwarding needs. </p>  
            <p>Your account has been successfully created, and you're now all set to take advantage of our comprehensive suite of shipping services. Whether you're shipping across the city or around the world, we're here to ensure your cargo reaches its destination safely and on time. </p> 
            <p>${content}</p>
            <p style="color:tomato; font-size:25px; letter-spacing:2px;"><b>${generatedOtp}</b></p>
            <p>This code <b>expires in ${duration} minute(s)</b>.</p>
            <br></br> 
            <p>Thank You,</p>
            <b style="color:#0088FF";>Eseport</b>`,
        };

        const mailStatus = await transporter.sendMail(mailOptions);
        const calculateTime = duration * 60 * 1000;

        const hashedOtp = await hashData(String(generatedOtp));
        const newOtp = new Otp({
            email,
            Otp: hashedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + calculateTime,
        });
        const createdOtpRecord = await newOtp.save();
        // console.log(createdOtpRecord , mailStatus);
        return createdOtpRecord;

    } catch (error) {
        throw error;
    }
};

module.exports = sendEmail;