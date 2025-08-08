// domain.com/verifytoken/afhiehihifwciiie
// domain.com/verifytoken?token=efjjijwicjiewjf

import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // create hashed token
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    // find a user
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    // use nodemailer and create a transport
    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      from: "vaishnavi@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>
  Click
  <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a>
  to
  ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
  or copy and paste the link below in your browser.
  <br />
  ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
</p>
`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
