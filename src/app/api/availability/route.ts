import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const availability = await prisma.availability.findMany({
      orderBy: { dayOfWeek: 'asc' },
    })
    return NextResponse.json(availability)
  } catch (error) {
    console.error('[GET /api/availability]', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Request body must be an array of availability records' },
        { status: 400 }
      )
    }

    // Validate each record
    for (const record of body) {
      if (
        record.dayOfWeek === undefined ||
        !record.startTime ||
        !record.endTime ||
        !record.timezone
      ) {
        return NextResponse.json(
          { error: 'Each record must have dayOfWeek, startTime, endTime, and timezone' },
          { status: 400 }
        )
      }
    }

    // Replace all availability in a transaction
    const availability = await prisma.$transaction(async (tx: any) => {
      await tx.availability.deleteMany()
      return tx.availability.createMany({
        data: body.map((record) => ({
          dayOfWeek: record.dayOfWeek,
          startTime: record.startTime,
          endTime: record.endTime,
          timezone: record.timezone,
        })),
      })
    })

    const updated = await prisma.availability.findMany({
      orderBy: { dayOfWeek: 'asc' },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[PUT /api/availability]', error)
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    )
  }
}
