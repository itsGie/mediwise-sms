import { generateRandomString } from "@/lib/random";
import sendMail from "@/lib/smtp";
import { RegisterUserSchema } from "@/schema/user";
import { createUser, generateHashPassword } from "@/service/user";
import { NextRequest, NextResponse } from "next/server";

/* 
  REGISTER USER
*/
export async function POST(req: NextRequest, { params }: { params: {} }) {
  try {
    const body = await RegisterUserSchema.safeParseAsync(await req.json());

    if (!body.success) {
      return NextResponse.json(
        {
          errors: body.error.flatten().fieldErrors,
          message: "Invalid body parameters",
        },
        { status: 400 }
      );
    }

    const {
      email,
      password,
      role,
      firstname,
      middlename,
      lastname,
      suffix,
      gender,
      dateOfBirth,
      homeNo,
      street,
      barangay,
      city,
      contactNo,
      zip,
      district
    } = body.data;

    // hash password
    const hashedPassword = await generateHashPassword(password);
    // verification code
    const code = generateRandomString(6);
    
    // create user
    const userCreated = await createUser({
      data: {
        email: email,
        hashedPassword: hashedPassword,
        vefificationCode: code,
        role: role,
        firstname,
        middlename,
        lastname,
        suffix,
        gender,
        dateOfBirth,
        homeNo,
        street,
        barangay,
        city,
        contactNo,
        zip,
        district
      },
    });

    const content = `
    <div> 
      <h3> hello ${userCreated.email} </h3>

      <h4>These is your verification code : ${code}</h4>
      <p> Please use this code to verify your account </p>
      <small> - SMS ADMIN </small>
    </div>
    `;

    // sendMail({ content, subject: "Email verification", emailTo: email });

    return NextResponse.json(`User ${email} registered successfully`, {
      status: 201,
    });
  } catch (error) {
    console.log("[REGISTER_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
