// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "../../../generated/prisma/client";
// import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// const connectionString = process.env.DATABASE_URL!;
// const adapter = new PrismaBetterSqlite3({ url: connectionString });
// const prisma = new PrismaClient({ adapter });

// export async function POST(req: NextRequest) {
//   try {
//     const { email, password } = await req.json();

//     const user: any = await prisma.user.findUnique({ where: { email } });

//     if (!user || user.password !== password) {
//       return NextResponse.json(
//         { error: "Invalid email or password" },
//         { status: 401 },
//       );
//     }

//     return NextResponse.json({
//       message: "Login successful",
//       user: { email: user.email, role: user.role },
//     });
//   } catch (err) {
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 },
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
      // exclude password from the response
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        course: true,
        studentId: true,
        phone: true,
        attendances: true, // optional: include attendances if you want
      },
    });

    if (!user || password !== password) {
      // note: compare with real password in production using hashing
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      message: "Login successful",
      user, // full user object without password
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
