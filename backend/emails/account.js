const sgMail = require('@sendgrid/mail');

//SETUP API KEY FOR SEND GRID
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendEmail = (email, subject, text) => {
    sgMail.send({
        to: email,
        from: 'chris@kit.com',
        subject,
        text
    });
}

module.exports = { sendEmail };