import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation (expand as needed)
    if (!body.subject || !body.date || !body.status) {
      return NextResponse.json(
        { error: 'Missing required fields (subject, date, status)' },
        { status: 400 }
      );
    }

    const newRecord = {
      id: crypto.randomUUID(),           
      ...body,
      createdAt: new Date().toISOString(),
    };

    console.log('New attendance record:', newRecord);

    // attendanceRecords.push(newRecord);

    // In real app: await prisma.attendance.create({ data: newRecord })

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error('POST /api/attendance error:', error);
    return NextResponse.json(
      { error: 'Failed to save attendance' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json([]);
}

