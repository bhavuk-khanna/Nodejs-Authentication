const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.resetPassword = (token) => {
    let htmlString = nodeMailer.renderTemplate({token: token},'reset/password_reset.ejs');
    console.log(token);
    nodeMailer.transporter.sendMail({
       from: ''/*insert from email address*/,
       to: token.user.email,
       subject: "Password reset email!",
       html: htmlString 
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return;
    });
}