import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import nodemailer from 'nodemailer';

function getClientIp(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    return forwarded ? forwarded.split(',')[0].trim() : 'Unknown IP';
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, message, phone, subject } = body;

        if (!name || !email || !message || !phone || !subject) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME as string);
        const teamEnquiryCollection = db.collection('contact');

        const clientIp = getClientIp(req);
        const newEnquiry = { name, email, message, clientIp, phone, subject, date: new Date() };

        await teamEnquiryCollection.insertOne(newEnquiry);

        if (!process.env.NOTIFICATION_EMAIL_ADDRESS || !process.env.NOTIFICATION_EMAIL_PASSWORD) {
            return NextResponse.json({ message: 'Mail credentials are missing' }, { status: 500 });
        }

          const  transporter = nodemailer.createTransport({
            host: 'smtp.zoho.in',
            port: 465,
            secure: true,
            auth: {
              user: process.env.NOTIFICATION_EMAIL_ADDRESS,  
              pass: process.env.NOTIFICATION_EMAIL_PASSWORD 
            }
          });

        const mailOptions = {
            from: process.env.NOTIFICATION_EMAIL_ADDRESS,
            to: process.env.TEAM_EMAIL_ADDRESS as string,
            subject: 'New Contact Request Received',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h2 style="color: #2C3E50;">Details:</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>IP Address:</strong> ${clientIp}</p>
                    <p><strong>Date:</strong> ${new Date()}</p>
                    <blockquote style="background-color: #f8f8f8; border-left: 3px solid #2C3E50; padding: 10px; margin: 10px 0;">
                        ${message}
                    </blockquote>
                    <p style="color: #7F8C8D;">This is an automated message. Please do not reply.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Submitted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error occurred:', error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// Handle OPTIONS requests for CORS
export function OPTIONS() {
    return NextResponse.json({}, { status: 200 });
}
