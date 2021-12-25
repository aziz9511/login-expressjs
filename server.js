var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'emailjunk430@gmail.com',
        pass: 'mabdulaziz2014tix',
    }
});

var mailOptions = {
    from: 'emailjunk430@gmail.com',  // sender address
    to: 'aziz8009@gmail.com',   // list of receivers
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
    html: '<b>Hey there! </b> <br> This is our first message sent with Nodemailer<br/>',
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) throw err;
    console.log('Email sent: ' + info.response);
});