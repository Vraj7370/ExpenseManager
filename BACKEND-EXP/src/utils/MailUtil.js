const mailer = require("nodemailer");

const mailSend = async (to, subject, text) => {
  const transport = mailer.createTransport({
    service: "gmail",
    auth: {
      user: "patelvraj7372@gmail.com",
      pass: "kaxwwuhfioisuwnb",
    },
  });
  const mailOptions = {
    to:to,
    from:"patelvraj7372@gmail.com",
    subject:subject,
    //text:text
    html:`<h1>${text}</h1>`
  };

  await transport.sendMail(mailOptions)

};
module.exports = mailSend