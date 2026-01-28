import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });

const prisma = new PrismaClient({ adapter });

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     if (!body.subject || !body.date || !body.status) {
//       return NextResponse.json(
//         { error: "Missing required fields (subject, date, status)" },
//         { status: 400 },
//       );
//     }
//     const newRecord = await prisma.attendance.create({
//       data: {
//         date: new Date(body.date),
//         subject: body.subject,
//         status: body.status,
//         method: body.method || "QR Scan",
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.subject || !body.date || !body.status) {
      return NextResponse.json(
        { error: "Missing required fields (subject, date, status)" },
        { status: 400 },
      );
    }

    const startOfDay = new Date(body.date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(body.date);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await prisma.attendance.findFirst({
      where: {
        subject: body.subject,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Attendance already marked for this subject today" },
        { status: 409 },
      );
    }

    const newRecord = await prisma.attendance.create({
      data: {
        date: new Date(body.date),
        subject: body.subject,
        status: body.status,
        method: body.method || "QR Scan",
      },
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("POST /api/attendance error:", error);
    return NextResponse.json(
      { error: "Failed to save attendance" },
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
