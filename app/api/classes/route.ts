import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });

const prisma = new PrismaClient({ adapter });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { classDate, day, noOfClasses } = body;

    if (!classDate || !day || !noOfClasses) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const created = await prisma.classToday.create({
      data: {
        classDate: new Date(classDate),
        day,
        noOfClasses,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/classes error:", err);
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const records = await prisma.classToday.findMany({
      where: {
        classDate: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { classDate: "asc" },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("GET /api/class-today error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
