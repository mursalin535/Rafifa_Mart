const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOtpEmail({ to, name, otp }) {
  const mailOptions = {
    from: `"Rafifa Mart" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify your email — Rafifa Mart',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0;padding:0;background-color:#0a0f0c;font-family:Georgia,'Times New Roman',serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0f0c;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background-color:#13201A;border:1px solid rgba(201,168,100,0.25);">
                
                <!-- Header -->
                <tr>
                  <td style="padding:32px 40px 24px;text-align:center;border-bottom:1px solid rgba(201,168,100,0.15);">
                    <p style="margin:0;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#C9A864;">
                      Rafifa Mart
                    </p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:36px 40px;">
                    <h1 style="margin:0 0 12px;font-size:22px;font-weight:normal;letter-spacing:0.08em;color:#F0EAD8;">
                      Verify Your Email
                    </h1>
                    <p style="margin:0 0 28px;font-size:13px;line-height:1.7;color:rgba(240,234,216,0.55);">
                      Hi ${name || 'there'}, use the code below to verify your account. It expires in <strong style="color:#C9A864;">1 minute</strong>.
                    </p>

                    <!-- OTP Box -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:20px;text-align:center;background-color:#0a0f0c;border:1px solid rgba(201,168,100,0.2);">
                          <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(240,234,216,0.35);">
                            Your verification code
                          </p>
                          <p style="margin:0;font-size:32px;letter-spacing:0.3em;font-weight:bold;color:#C9A864;font-family:monospace;">
                            ${otp}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:28px 0 0;font-size:12px;line-height:1.6;color:rgba(240,234,216,0.35);">
                      If you didn't request this, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px;text-align:center;border-top:1px solid rgba(201,168,100,0.15);">
                    <p style="margin:0;font-size:10px;letter-spacing:0.15em;color:rgba(240,234,216,0.25);">
                      &copy; ${new Date().getFullYear()} Rafifa Mart. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendOtpEmail };
