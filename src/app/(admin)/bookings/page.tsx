'use client'

import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { Calendar, Clock, XCircle, CheckCircle2 } from 'lucide-react'

type Booking = {
  id: string
  eventTypeId: string
  bookerName: string
  bookerEmail: string
  startTime: string
  endTime: string
  status: 'confirmed' | 'cancelled'
  createdAt: string
  eventType: {
    title: string
  } | null
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [isLoading, setIsLoading] = useState(true)
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings')
      if (!res.ok) throw new Error('Failed to fetch bookings')
      const data = await res.json()
      setBookings(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    setCancelingId(id)
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
      })
      if (!res.ok) throw new Error('Failed to cancel booking')
      
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
      )
    } catch (err: any) {
      alert(err.message)
    } finally {
      setCancelingId(null)
    }
  }

  const now = new Date()

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' && new Date(b.startTime) > now
  )

  const pastBookings = bookings.filter(
    (b) => b.status === 'cancelled' || new Date(b.startTime) <= now
  )

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Bookings</h1>
      </div>

      <div className="mb-6 border-b border-[#e5e7eb]">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`whitespace-nowrap border-b-2 pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'border-[#111827] text-[#111827]'
                : 'border-transparent text-[#6b7280] hover:text-[#374151] hover:border-[#d1d5db]'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`whitespace-nowrap border-b-2 pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'past'
                ? 'border-[#111827] text-[#111827]'
                : 'border-transparent text-[#6b7280] hover:text-[#374151] hover:border-[#d1d5db]'
            }`}
          >
            Past
          </button>
        </nav>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#111827]" />
        </div>
      ) : displayedBookings.length === 0 ? (
        <div className="rounded-xl border border-[#e5e7eb] bg-white p-12 text-center">
          <Calendar className="mx-auto mb-3 h-10 w-10 text-[#d1d5db]" />
          <h3 className="text-sm font-semibold text-[#111827]">
            No {activeTab} bookings
          </h3>
          <p className="mt-1 text-sm text-[#6b7280]">
            {activeTab === 'upcoming'
              ? "You don't have any upcoming bookings right now."
              : 'You have no past or cancelled bookings.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
          {displayedBookings.map((booking, idx) => {
            const startDate = dayjs(booking.startTime)
            const endDate = dayjs(booking.endTime)
            const eventTitle = booking.eventType?.title || 'Deleted Event'

            return (
              <div
                key={booking.id}
                className={`flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-[#f9fafb] sm:flex-row sm:items-center sm:justify-between ${
                  idx !== 0 ? 'border-t border-[#e5e7eb]' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-[#f3f4f6] text-center">
                      <span className="text-xs font-medium text-[#6b7280]">
                        {startDate.format('MMM')}
                      </span>
                      <span className="text-sm font-bold text-[#111827]">
                        {startDate.format('D')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">
                      {eventTitle}
                    </p>
                    <p className="mt-0.5 text-xs text-[#6b7280]">
                      {startDate.format('ddd, MMM D')} · {startDate.format('h:mm A')} - {endDate.format('h:mm A')}
                    </p>
                    <p className="mt-0.5 text-xs text-[#9ca3af]">
                      {booking.bookerName} · {booking.bookerEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {booking.status === 'confirmed' ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Confirmed
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-[#f3f4f6] px-2.5 py-1 text-xs font-medium text-[#6b7280] ring-1 ring-inset ring-[#e5e7eb]">
                      <XCircle className="mr-1 h-3 w-3" />
                      Cancelled
                    </span>
                  )}

                  {booking.status === 'confirmed' && new Date(booking.startTime) > now && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancelingId === booking.id}
                      className={`rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-xs font-medium text-[#6b7280] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 ${
                        cancelingId === booking.id ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      {cancelingId === booking.id ? 'Canceling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
