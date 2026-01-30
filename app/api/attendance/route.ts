import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { Resend } from "resend";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });

const prisma = new PrismaClient({ adapter });
const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { userId, subject, date, status, method } = body;

//     if (!userId || !subject || !date || !status) {
//       return NextResponse.json(
//         { error: "Missing required fields (userId, subject, date, status)" },
//         { status: 400 },
//       );
//     }

//     const startOfDay = new Date(date);
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(date);
//     endOfDay.setHours(23, 59, 59, 999);

//     const existing = await prisma.attendance.findFirst({
//       where: {
//         userId,
//         subject,
//         date: {
//           gte: startOfDay,
//           lte: endOfDay,
//         },
//       },
//     });

//     if (existing) {
//       return NextResponse.json(
//         { error: "Attendance already marked for this user today" },
//         { status: 409 },
//       );
//     }

//     const newRecord = await prisma.attendance.create({
//       data: {
//         date: new Date(date),
//         subject,
//         status,
//         method: method || "QR Scan",
//         user: { connect: { id: userId } },
//       },
//       include: {
//         user: true,
//       },
//     });

//     return NextResponse.json(newRecord, { status: 201 });
//   } catch (error) {
//     console.error("POST /api/attendance error:", error);
//     return NextResponse.json(
//       { error: "Failed to save attendance" },
//       { status: 500 },
//     );
//   }
// }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, date, subject, status, method } = body;

    if (!userId || !date || !subject || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // save attendance
    const attendance = await prisma.attendance.create({
      data: {
        userId,
        date: new Date(date),
        subject,
        status,
        method,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (status === "Present" && user?.email) {
      await resend.emails.send({
        from: "SmartAttend <onboarding@resend.dev>",
        to: user.email,
        subject: "Attendance Marked ✅",
        html: `
          <p>Hi ${user.name ?? "Student"},</p>
          <p>Your attendance has been marked <b>Present</b>.</p>
          <p><b>Subject:</b> ${subject}</p>
          <p><b>Date:</b> ${new Date(date).toDateString()}</p>
          <br/>
          <p>– SmartAttend</p>
        `,
      });
    }

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Attendance POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const records = await prisma.attendance.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("GET /api/attendance error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
