import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import nodemailer from "nodemailer";

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0] || "Unknown IP";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, type } = body;

    if (!email) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB_NAME as string);
    const teamNotifyCollection = db.collection("notifications");

    const clientIp = getClientIp(req);
    const newNotify = { email, type, clientIp, date: new Date() };

    await teamNotifyCollection.insertOne(newNotify);

    if (!process.env.NOTIFICATION_EMAIL_ADDRESS || !process.env.NOTIFICATION_EMAIL_PASSWORD) {
      return NextResponse.json({ message: 'Mail credentials are missing' }, { status: 500 });
    }
    const transporter = nodemailer.createTransport({
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
      subject: "Notification Request Received",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="color: #2C3E50;">Details:</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>IP Address:</strong> ${clientIp}</p>
          <p><strong>Date:</strong> ${new Date()}</p>
          <p style="color: #7F8C8D;">This is an automated message. Please do not reply.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Notification request added. " }, { status: 200 });
  } catch (error: any) {
    console.error("Error occurred:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
