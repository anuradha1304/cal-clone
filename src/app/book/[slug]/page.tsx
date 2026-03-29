import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { BookingFlow } from './BookingFlow'

export default async function BookingPage({
  params,
}: {
  params: { slug: string }
}) {
  const eventType = await prisma.eventType.findUnique({
    where: { slug: params.slug },
  })

  if (!eventType) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingFlow
        eventType={{
          id: eventType.id,
          title: eventType.title,
          description: eventType.description,
          duration: eventType.duration,
          slug: eventType.slug,
        }}
      />
    </div>
  )
}