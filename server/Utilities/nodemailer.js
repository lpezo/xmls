    var nodemailer = require('nodemailer');
    console.log("nodeMailerSample()");

    console.log("Creating transport...");
    var transporter = nodemailer.createTransport({
      service: 'gmail', //al usar un servicio bien conocido, no es necesario proveer un nombre de servidor.
      auth: {
        user: 'lpezo777@gmail.com',
        pass: 'enotriaweb01'
      },
      proxy: 'http://proxy-chain.intel.com:911'
    });

    var mailOptions = {
      from: 'lpezo777@gmail.com',
      to: 'lpezo777@hotmail.com',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
    };

    console.log("sending email", mailOptions);
    transporter.sendMail(mailOptions, function (error, info) {
      console.log("senMail returned!");
      if (error) {
        console.log("ERROR!!!!!!", error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    console.log("End of Script");