import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteContext = { params: { id: string } }

export async function PATCH(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: 'cancelled' },
      include: { eventType: true },
    })

    return NextResponse.json(booking)
  } catch (error: any) {
    console.error('[PATCH /api/bookings/[id]]', error)
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}
