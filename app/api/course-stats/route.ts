import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });

const prisma = new PrismaClient({ adapter });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { course, totalStudents } = body;

    const record = await prisma.courseStats.upsert({
      where: { course },
      update: { totalStudents },
      create: { course, totalStudents },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("POST /api/course-stats error:", error);
    return NextResponse.json(
      { message: "Failed to create course stats" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const records = await prisma.courseStats.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("GET /api/course-stats error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
