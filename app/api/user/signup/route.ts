import createDB from "@/db";
import { userRoles, users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Enter a valid Email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(userRoles.enumValues),
    employeeId: z.string().min(1, "Employee ID is required"),
});

export async function POST(req: NextRequest) {
    const genHashedPassword = async (password: string): Promise<string> => {
        return await bcrypt.hash(password, 10);
    };

    try {
        const body = await req.json();

        // Validate the request body using the Zod schema
        const parsedBody = signupSchema.parse(body);
        const { employeeId, name, email, password, role } = parsedBody;

        const db = await createDB();

        // Check if email already exists
        const existingEmail = await db
            .select({
                id: users.id,
            })
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingEmail.length > 0) {
            return NextResponse.json(
                { code: 1, message: "Email is already registered" },
                { status: 400 }
            );
        }

        // Check if employee ID already exists
        const existingEmployeeId = await db
            .select()
            .from(users)
            .where(eq(users.employeeId, employeeId))
            .limit(1);

        if (existingEmployeeId.length > 0) {
            return NextResponse.json(
                { code: 1, message: "Employee ID is already registered" },
                { status: 400 }
            );
        }

        const hashedPassword = await genHashedPassword(password);

        // Insert new employee
        await db.insert(users).values({
            employeeId,
            name,
            email,
            password: hashedPassword,
            role,
        });

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in environment variables");
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
            expiresIn: "10h",
        });

        return NextResponse.json(
            { code: 0, message: "Signed up successfully", token },
            { status: 201 }
        );
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    code: 1,
                    message: error.errors.map((err) => err.message).join(", "),
                },
                { status: 400 }
            );
        }

        console.error("Signup error:", error);
        return NextResponse.json(
            { code: 1, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
