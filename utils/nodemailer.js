const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_APIKEY,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

const message = {
    from: process.env.EMAIL_USERNAME,
    to: process.env.EMAIL_TEST,
    subject: 'learning backend email functionality test',
    text: 'testing, 1, 2, 3 testing'

};

transporter.sendMail(message, (err, info) =>
    err ? console.log(err) : console.log('email sent', info)
);

