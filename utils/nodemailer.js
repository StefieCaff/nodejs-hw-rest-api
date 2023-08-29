const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport(
    {
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_APIKEY,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
const sendVerificationEmail = async (email, verificationToken) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Verify your email please :)',
        text: `<p>
                  Hello, please verify your email by clicking
                  <a href="http://localhost:3000/api/contacts/users/verify/${verificationToken}">
                  <strong>here<strong>, thanks!
                  </a>
               </p>`

    };
    try {
        await transporter.sendMail(mailOptions, (err, info) =>
            err ? console.log(err) : console.log('email sent', info)
        );
    } catch (err) {
        console.error('Error sending verification email:', err);
    }
};

module.exports = sendVerificationEmail;
