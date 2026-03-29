import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const eventTypes = await prisma.eventType.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(eventTypes)
  } catch (error) {
    console.error('[GET /api/event-types]', error)
    return NextResponse.json(
      { error: 'Failed to fetch event types' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, duration, slug } = body

    if (!title || !duration || !slug) {
      return NextResponse.json(
        { error: 'title, duration, and slug are required' },
        { status: 400 }
      )
    }

    const eventType = await prisma.eventType.create({
      data: { title, description, duration, slug },
    })

    return NextResponse.json(eventType, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/event-types]', error)
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'A event type with that slug already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create event type' },
      { status: 500 }
    )
  }
}
