import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '../../../../lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    const supabase = await createClient()

    if (!email || !password) {
      return NextResponse.json({ code: 1, message: 'Email and password are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('employee')
      .select('e_password')
      .eq('email', email)
      .single();

    if (error || !data) {
      return NextResponse.json({ code: 1, message: 'Invalid password or email' }, { status: 400 });
    }

    const isCorrectPassword = await bcrypt.compare(password, data.e_password);

    if (!isCorrectPassword) {
      return NextResponse.json({ code: 1, message: 'Invalid password' }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is missing in environment variables');
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET as string,
      { expiresIn: "10h" }
    );
    
    return NextResponse.json({ code: 0, message: 'Signed in successfully', token: token }, { status: 200 });

  } catch (error: any) {
    console.error('Sign-in error:', error);
    return NextResponse.json({ code: 1, message: error.message }, { status: 500 });
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}