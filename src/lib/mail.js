import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendNotification = async (subject, text) => {
    // If credentials are not set, log warning and return (prevent crash in dev)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not found in env. Email notification skipped.');
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: 'giner.sanchez@yahoo.fr', // list of receivers (hardcoded as requested)
            subject: `[Lexence Idées] ${subject}`, // Subject line
            text: text, // plain text body
            // html: "<b>Hello world?</b>", // html body
        });

        console.log('Notification email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email notification:', error);
    }
};
