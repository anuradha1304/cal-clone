import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Converts a "HH:MM" time string to total minutes from midnight.
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Converts total minutes from midnight to a "HH:MM" string.
 */
function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0')
  const m = (minutes % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

/**
 * GET /api/bookings/slots?slug=30min&date=2026-03-29
 *
 * Returns an array of { time: "HH:MM", available: boolean } objects
 * for all slots in the availability window on the given date.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const date = searchParams.get('date')

    if (!slug || !date) {
      return NextResponse.json(
        { error: '`slug` and `date` query parameters are required' },
        { status: 400 }
      )
    }

    // --- 1. Resolve event type by slug ---
    const eventType = await prisma.eventType.findFirst({ where: { slug } })

    if (!eventType) {
      return NextResponse.json(
        { error: `Event type with slug "${slug}" not found` },
        { status: 404 }
      )
    }

    const { duration } = eventType // duration in minutes

    // --- 2. Determine day of week for requested date ---
    // Parse date as UTC to avoid timezone shifts changing the day
    const [year, month, day] = date.split('-').map(Number)
    const requestedDate = new Date(Date.UTC(year, month - 1, day))
    const dayOfWeek = requestedDate.getUTCDay() // 0 = Sunday, 6 = Saturday

    // --- 3. Fetch availability for that day of week ---
    const availability = await prisma.availability.findFirst({
      where: { dayOfWeek },
    })

    if (!availability) {
      return NextResponse.json([]) // No availability configured for this day
    }

    // --- 4. Generate all possible slots ---
    const startMinutes = timeToMinutes(availability.startTime)
    const endMinutes = timeToMinutes(availability.endTime)

    const allSlots: string[] = []
    for (let t = startMinutes; t + duration <= endMinutes; t += duration) {
      allSlots.push(minutesToTime(t))
    }

    // --- 5. Fetch confirmed bookings for this date + event type ---
    // Build start/end of day boundaries in UTC
    const dayStart = new Date(Date.UTC(year, month - 1, day, 0, 0, 0))
    const dayEnd = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))

    const confirmedBookings = await prisma.booking.findMany({
      where: {
        eventTypeId: eventType.id,
        status: 'confirmed',
        startTime: { gte: dayStart, lte: dayEnd },
      },
    })

    // --- 6. Build set of booked slot times for O(1) lookup ---
    const bookedTimes = new Set(
      confirmedBookings.map((booking: any) => {
        const d = new Date(booking.startTime)
        const hh = d.getUTCHours().toString().padStart(2, '0')
        const mm = d.getUTCMinutes().toString().padStart(2, '0')
        return `${hh}:${mm}`
      })
    )

    // --- 7. Return slots with availability flag ---
    const slots = allSlots.map((time) => ({
      time,
      available: !bookedTimes.has(time),
    }))

    return NextResponse.json(slots)
  } catch (error) {
    console.error('[GET /api/bookings/slots]', error)
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    )
  }
}
