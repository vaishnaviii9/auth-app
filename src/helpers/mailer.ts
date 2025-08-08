import nodemailer, { SentMessageInfo } from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

interface SendEmailParams {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailParams): Promise<SentMessageInfo> => {
  try {
    // create hashed token
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    // find and update user
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

    // nodemailer transport
    let transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const actionPath = emailType === "VERIFY" ? "verifyemail" : "forgotpassword";
    const subjectText = emailType === "VERIFY" ? "Verify your email" : "Reset your password";

    const mailOptions = {
      from: "vaishnavi@gmail.com",
      to: email,
      subject: subjectText,
      html: `
        <p>
          Click <a href="${process.env.DOMAIN}/${actionPath}?token=${hashedToken}">here</a> to 
          ${subjectText.toLowerCase()} 
          or copy and paste the link below in your browser.
        </p>
        <br>
        <p>${process.env.DOMAIN}/${actionPath}?token=${hashedToken}</p>
      `,
    };

    return await transport.sendMail(mailOptions);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred while sending email");
  }
};
