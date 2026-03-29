import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteContext = { params: { id: string } }

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params
    const eventType = await prisma.eventType.findUnique({ where: { id } })
    if (!eventType) {
      return NextResponse.json({ error: 'Event type not found' }, { status: 404 })
    }
    return NextResponse.json(eventType)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch event type' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, duration, slug } = body

    const eventType = await prisma.eventType.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(duration !== undefined && { duration }),
        ...(slug !== undefined && { slug }),
      },
    })

    return NextResponse.json(eventType)
  } catch (error: any) {
    console.error('[PUT /api/event-types/[id]]', error)
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Event type not found' }, { status: 404 })
    }
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'A event type with that slug already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update event type' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params

    await prisma.eventType.delete({ where: { id } })

    return NextResponse.json({ message: 'Event type deleted successfully' })
  } catch (error: any) {
    console.error('[DELETE /api/event-types/[id]]', error)
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Event type not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: 'Failed to delete event type' },
      { status: 500 }
    )
  }
}
