const { createTransport } = require("nodemailer");
require("dotenv").config();

// Need to update to real host when pushed to prod
// const transport = createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 465,
//   auth: {
//     user: process.env.SMTP_EMAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

function emailFormat(text) {
  console.log("enter make a nice email");
  return `
    <div style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hello There!</h2>
      <p>${text}</p>
      <p>From the team at, Chatter</p>
    </div>
  `;
}

async function sendPasswordResetEmail(resetToken, to) {
  console.log("enter func");
  const info = await transport.sendMail({
    to,
    from: process.env.SMTP_EMAIL,
    subject: "Your password reset token!",
    html: emailFormat(`Your password reset token is here!
    <a href="${process.env.CLIENT_URL}/reset?token=${resetToken}
    "> Click Here to reset </a>
    `),
  });
  console.log("info", info);
}

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendResetSendGrid(resetToken, to) {
  const message = {
    to,
    from: "chattermessengerapp@gmail.com",
    subject: "Your password reset token!",
    html: emailFormat(`Your password reset token is here!
    <a href="${process.env.CLIENT_URL}/reset?token=${resetToken}
    "> Click Here to reset </a>
    `),
  };
  await sgMail.send(message).then("Email sent");
}

module.exports = {
  sendPasswordResetEmail,
  sendResetSendGrid,
};
