var nodemailer = require('nodemailer');
var userDao = require('../DAO/userDAO');
var fs = require('fs');

var getAuth = () => {
    let scred = fs.readFileSync('./credentials.json');
    let cred = JSON.parse(scred);
    let stoken = fs.readFileSync('./token.json');
    let token = JSON.parse(stoken);

    return {
        type: 'OAuth2',
        user: 'lpezo777@gmail.com',
        clientId: cred.client_id,
        clientSecret: cred.client_secret,
        refreshToken: token.refresh_token,
        accessToken: token.access_token,
        expires: token.expiry_date
    };
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: getAuth()
   });

const mailOptions = {
    from: 'myxml@gmail.com',
    subject: '[proceso %name%] aviso de termino de proceso',
    html: '<p>El proceso del proyecto []%name%] ya ha terminado, puede descargar el excel desdel la pagina web del aplicativo.</p>'
};

const sendAvisoFin = (proy) => {
    return new Promise((resolve, reject)=>{
nom
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