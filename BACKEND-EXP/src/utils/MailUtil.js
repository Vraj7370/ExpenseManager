const mailer = require("nodemailer");

const mailSend = async (to, subject, text) => {
  const transport = mailer.createTransport({
    service: "gmail",
    auth: {
      user: "dhruvishp188@gmail.com",
      pass: "homn adie aicx abzw",
    },
  });
  const mailOptions = {
    to:to,
    from:"dhruvishp188@gmail.com",
    subject:subject,
    //text:text
    html:`<h1>${text}</h1>`
  };

  await transport.sendMail(mailOptions)

};
module.exports = mailSend