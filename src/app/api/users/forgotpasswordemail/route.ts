import { connect } from "@/dbConfig/dbConfig";
import { NextRequest,NextResponse} from "next/server";
import { sendEmail } from "@/helpers/mailer";
import User from "@/models/userModel";

connect()

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const {email} = reqBody;

    const user= await User.findOne({email})

    if(!user){
      return NextResponse.json(
      {
       message:"User not found"
      },
      {
        status: 400,
      }
    );
    }

    //send email

    await sendEmail(
      {
        email,
        emailType: "RESET",
        userId: user._id 
      }
    )

    return NextResponse.json(
      {
        message: "Reset email sent successfully",
        success:true
      },
      {
        status: 200

      }
    )
  } catch (error:any) {
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