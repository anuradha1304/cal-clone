import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ExternalLink, Edit2, Clock } from 'lucide-react'
import { DeleteButton } from './components/DeleteButton'
import { CopyLinkButton } from './components/CopyLinkButton'

export const dynamic = 'force-dynamic'

export default async function EventTypesPage() {
  const eventTypes = await prisma.eventType.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
            Event types
          </h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Create and manage scheduling links for your calendar.
          </p>
        </div>
        <Link
          href="/event-types/new"
          className="inline-flex items-center justify-center rounded-lg bg-[#111827] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1f2937]"
        >
          New event type
        </Link>
      </div>

      {eventTypes.length === 0 ? (
        <div className="rounded-xl border border-[#e5e7eb] bg-white p-14 text-center">
          <h3 className="text-sm font-semibold text-[#111827]">No event types yet</h3>
          <p className="mt-1 text-sm text-[#6b7280]">
            Create your first event type to start accepting bookings.
          </p>
          <div className="mt-6">
            <Link
              href="/event-types/new"
              className="inline-flex items-center rounded-lg bg-[#111827] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1f2937]"
            >
              New event type
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
          {eventTypes.map((eventType, idx) => (
            <div
              key={eventType.id}
              className={`flex items-center justify-between px-6 py-5 transition-colors hover:bg-[#f9fafb] ${
                idx !== 0 ? 'border-t border-[#e5e7eb]' : ''
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#111827]" />
                  <h3 className="truncate text-sm font-semibold text-[#111827]">
                    {eventType.title}
                  </h3>
                </div>
                {eventType.description && (
                  <p className="ml-5 mt-0.5 truncate text-sm text-[#6b7280]">
                    {eventType.description}
                  </p>
                )}
                <div className="ml-5 mt-1 flex items-center gap-4 text-xs text-[#9ca3af]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {eventType.duration}m
                  </span>
                  <Link
                    href={`/book/${eventType.slug}`}
                    target="_blank"
                    className="flex items-center gap-1 transition-colors hover:text-[#111827]"
                  >
                    /book/{eventType.slug}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <CopyLinkButton slug={eventType.slug} />
                <Link
                  href={`/event-types/${eventType.id}/edit`}
                  className="rounded-lg p-2 text-[#9ca3af] transition-colors hover:bg-[#f3f4f6] hover:text-[#111827]"
                  aria-label="Edit Event"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </Link>
                <DeleteButton id={eventType.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}