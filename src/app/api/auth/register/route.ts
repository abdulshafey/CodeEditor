import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";
import { connectDB } from "@/config/connectToDb";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error:
            "All fields are required. Please provide name, email, and password.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A user with this email already exists. Please use a different email or log in instead.",
        },
        { status: 409 }
      );
    }

    const newUser = await UserModel.create({
      name,
      email,
      password,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. Welcome aboard!",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          picture: newUser.picture,
        },
      },
      { status: 201 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Registration Error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "An unexpected error occurred during registration. Please try again later.",
      },
      { status: 500 }
    );
  }
}
