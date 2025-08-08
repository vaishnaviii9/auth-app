import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { error, log } from "console";
connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { token, newPassword } = reqBody;

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid Token",
        },
        { status: 400 }
      );
    }

    console.log(user);
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      {
        message: "Password changed",
        success: true,
      },

      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
