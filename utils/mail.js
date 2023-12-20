const { createTransport } = require('nodemailer');
require('dotenv').config();


// Need to update to real host when pushed to prod
const transport = createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'austyn.farrell14@ethereal.email',
    pass: 'AYFQcpxBjtFCEmKWYa',
  }
})

function emailFormat(text) {
  console.log('enter make a nice email');
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
  
  console.log('enter func')
  const info = await transport.sendMail({
    to,
    from: 'test@example.com',
    subject: 'Your password reset token!',
    html: emailFormat(`Your password reset token is here!
    <a href="${process.env.CLIENT_URL}/reset?token=${resetToken}
    "> Click Here to reset </a>
    `),
  });
  console.log('info', info);
}

module.exports = {
  sendPasswordResetEmail,
}