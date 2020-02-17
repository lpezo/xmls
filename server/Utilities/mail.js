var nodemailer = require('nodemailer');
var userDao = require('../DAO/userDAO');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'lpezo777@gmail.com',
           pass: 'enotriaweb01'
       }
   });

const mailOptions = {
    from: 'myxml@gmail.com',
    subject: '[proceso %name%] aviso de termino de proceso',
    html: '<p>El proceso del proyecto []%name%] ya ha terminado, puede descargar el excel desdel la pagina web del aplicativo.</p>'
};

const sendAvisoFin = (proy) => {
    return new Promise((resolve, reject)=>{

        userDao.getUser(proy.user).then(user=>{
            mailOptions.to = user.email;
            mailOptions.subject = mailOptions.subject.replace("%name%", proy.name);
            mailOptions.html = mailOptions.html.replace("%name%", proy.name);
        
            transporter.sendMail(mailOptions, function(err, info){
                if (err)
                    return reject(err);
                resolve(info);
            });
        }).catch(err=>{
            reject(err);
        })
    })
};

module.exports = {
    sendAvisoFin
};