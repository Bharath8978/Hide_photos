const otpgenerate = require('otp-generator')
const nodemailer = require('nodemailer');
let data={};
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bharathbrave99@gmail.com',
        pass: 'niyw bqwy haqc ewbf'
    }
});
async function otp(mail) {
        const otpp = otpgenerate.generate(6, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets:false});
        data = {
            otp:otpp
        }
        let  mailOptions = {
            from: 'HIDING PHOTOS',
            to: `${mail}`,
            subject: 'UNKNOWN KING',
            text: `your otp is ${otpp}` 
        }
        await transporter.sendMail(mailOptions, (error, info) => {
            console.log('Message sent successfully!');
            console.log('Message ID:', info.messageId);
        });

        console.log(`OTP sent successfully to ${mail}`);
    }
async function verifyOtp(userOtp){
    otpp=String(data.otp)
    userotp = String(userOtp.userOtp);
    console.log("otpp:", otpp);
    console.log("userOtp:", userotp);

    if (otpp === userotp) {
        console.log("true");
        return true;
    }
    
    else{
        console.log("false")
        return false;
    }
}
module.exports={otp,verifyOtp};