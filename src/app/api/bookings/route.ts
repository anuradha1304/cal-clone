import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: { eventType: true },
      orderBy: { startTime: 'desc' },
    })
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('[GET /api/bookings]', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventTypeId, bookerName, bookerEmail, startTime, endTime } = body

    if (!eventTypeId || !bookerName || !bookerEmail || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'eventTypeId, bookerName, bookerEmail, startTime, and endTime are required' },
        { status: 400 }
      )
    }

    // Check for conflicting confirmed bookings
    const conflict = await prisma.booking.findFirst({
      where: {
        eventTypeId,
        status: 'confirmed',
        startTime: new Date(startTime),
      },
    })

    if (conflict) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        eventTypeId,
        bookerName,
        bookerEmail,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: 'confirmed',
      },
      include: { eventType: true },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('[POST /api/bookings]', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
