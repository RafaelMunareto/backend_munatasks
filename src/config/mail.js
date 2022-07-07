const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

// async..await is not allowed in global scope, must use a wrapper
module.exports = {
  async enviarEmail(de = 'Munatasks <suporte@munatask.com>', para, assunto, body) {
    var transporter = nodemailer.createTransport(
      smtpTransport({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        auth: {
          user: 'suporte@munatask.com',
          pass: 'Rafa007986*',
        },
      })
    );

    var mailOptions = {
      from: {
        name: 'Munatasks',
        address: 'suporte@munatask.com'
      },
      to: para,
      subject: assunto,
      html: body,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return 'Erro ' + error;
      } else {
        console.log('Email enviado: ' + info.response);
        return 'Email enviado: ' + info.response;
      }
    });
  },
};
