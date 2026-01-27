import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });

const prisma = new PrismaClient({ adapter });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.subject || !body.date || !body.status) {
      return NextResponse.json(
        { error: "Missing required fields (subject, date, status)" },
        { status: 400 },
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
    console.log("New attendance record:", newRecord);
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
  // Fetch all attendance records
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
