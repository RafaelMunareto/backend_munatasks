const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');


// async..await is not allowed in global scope, must use a wrapper
module.exports = {

    async enviarEmail(
        de = '"Munatasks" <foo@example.com>',
        para,
        assunto,        
        body
        ){
            var transporter = nodemailer.createTransport(smtpTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                  user: 'adriano.ianase.testes@gmail.com',
                  pass: 'ColocarASenhaAqui'
                }
              }));
              
              var mailOptions = {
                from: de,
                to: para,
                subject: assunto,
                html: body
              };
              
              await transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                  return 'Erro ' + error;
                } else {
                  console.log('Email enviado: ' + info.response);
                  return 'Email enviado: ' + info.response;
                }
              });  
    
        }
}
