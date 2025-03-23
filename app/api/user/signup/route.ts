import { NextRequest, NextResponse } from "next/server";
import { createClient } from '../../../../lib/supabase'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

export async function POST(req: NextRequest) {

  const genHasPass = async (e_password: string): Promise<string> => {
    return await bcrypt.hash(e_password, 10)
  }

  const validateEmail = (email: string): boolean => {
    return validator.isEmail(email)
  }

  try {
    const supabase = await createClient()
    const body = await req.json();
    const { e_name, email, e_password, e_role, e_id } = body;

    if (!e_name || !email || !e_password || !e_role || !e_id) {
      return NextResponse.json({ code: 1, message: "Name, email, password, employee id and employee's role are required" }, { status: 400 });
    }

    const checkEmail = validateEmail(email)
    if (!checkEmail) {
      return NextResponse.json(
        { message: "Enter a valid Email" },
        { status: 400 }
      );
    }

    const { data: emailData, error: emailError } = await supabase
      .from('employee')
      .select('email')
      .eq('email', email)
      .single();

    if (emailData?.email === email) {
      return NextResponse.json(
        { code: 1, message: 'Email is already registered', emailError },
        { status: 400 }
      );
    }

    const { data: e_IdData, error: e_IdError } = await supabase
      .from('employee')
      .select('e_id')
      .eq('e_id', e_id)
      .single();

    if (e_IdData?.e_id === e_id) {
      return NextResponse.json(
        { code: 1, message: 'Employee Id is already registered', e_IdError },
        { status: 400 }
      );
    }

    const hashedPassword = await genHasPass(e_password)

    const { error } = await supabase
      .from('employee')
      .insert({ e_name: e_name, email: email, e_password: hashedPassword, e_role: e_role, e_id: e_id })

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET as string,
      { expiresIn: "10h" }
    );

    return NextResponse.json({ code: 0, message: "Signed up successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
