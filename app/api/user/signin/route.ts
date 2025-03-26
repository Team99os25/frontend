import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createDB from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { code: 1, message: "Email and password are required" },
                { status: 400 }
            );
        }

        const db = await createDB();

        // Fetch user data from the database using Drizzle
        const user = await db
            .select({
                password: users.password,
            })
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (!user || user.length === 0) {
            return NextResponse.json(
                { code: 1, message: "Invalid email or password" },
                { status: 400 }
            );
        }

        const isCorrectPassword = await bcrypt.compare(
            password,
            user[0].password
        );

        if (!isCorrectPassword) {
            return NextResponse.json(
                { code: 1, message: "Invalid password" },
                { status: 401 }
            );
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in environment variables");
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
            expiresIn: "10h",
        });

        return NextResponse.json(
            { code: 0, message: "Signed in successfully", token: token },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Sign-in error:", error);
        return NextResponse.json(
            { code: 1, message: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

export function OPTIONS() {
    return NextResponse.json({}, { status: 200 });
}
