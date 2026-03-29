'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  User,
  Mail,
  Globe,
  Video,
  Link2,
  ChevronDown,
} from 'lucide-react'

type EventType = {
  id: string
  title: string
  description: string | null
  duration: number
  slug: string
}

type Slot = {
  time: string
  available: boolean
}

type BookingConfirmation = {
  bookerName: string
  bookerEmail: string
  startTime: string
  endTime: string
}

function formatSlotTime(time24: string): string {
  const [h, m] = time24.split(':').map(Number)
  const suffix = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 || 12
  return `${h12}:${m.toString().padStart(2, '0')}${suffix}`
}

export function BookingFlow({ eventType }: { eventType: EventType }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const [bookerName, setBookerName] = useState('')
  const [bookerEmail, setBookerEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(
    null
  )

  const tz =
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'UTC'

  const today = dayjs().startOf('day')

  useEffect(() => {
    if (!selectedDate) return

    setLoadingSlots(true)
    setSlots([])
    setSelectedTime(null)

    fetch(`/api/bookings/slots?slug=${eventType.slug}&date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSlots(data)
        else setSlots([])
      })
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false))
  }, [selectedDate, eventType.slug])

  const daysInMonth = currentMonth.daysInMonth()
  const firstDayOfMonth = currentMonth.startOf('month').day()
  const monthDays: (number | null)[] = []

  for (let i = 0; i < firstDayOfMonth; i++) {
    monthDays.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    monthDays.push(d)
  }

  const isDateDisabled = (day: number) => {
    const date = currentMonth.date(day).startOf('day')
    return date.isBefore(today)
  }

  const formatDateString = (day: number) => {
    return currentMonth.date(day).format('YYYY-MM-DD')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return

    setIsSubmitting(true)
    setError(null)

    const trimmedName = bookerName.trim()
    const trimmedEmail = bookerEmail.trim()

    const [hours, minutes] = selectedTime.split(':').map(Number)
    const startTime = dayjs(selectedDate)
      .hour(hours)
      .minute(minutes)
      .second(0)
      .toISOString()
    const endTime = dayjs(selectedDate)
      .hour(hours)
      .minute(minutes + eventType.duration)
      .second(0)
      .toISOString()

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventTypeId: eventType.id,
          bookerName: trimmedName,
          bookerEmail: trimmedEmail,
          startTime,
          endTime,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create booking')
      }

      setConfirmation({
        bookerName: trimmedName,
        bookerEmail: trimmedEmail,
        startTime,
        endTime,
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getGoogleCalendarLink = () => {
    if (!confirmation) return '#'
    const start = dayjs(confirmation.startTime).format('YYYYMMDDTHHmmss')
    const end = dayjs(confirmation.endTime).format('YYYYMMDDTHHmmss')
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: eventType.title,
      dates: `${start}/${end}`,
      details: eventType.description || '',
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  /* ───────── Confirmation Screen ───────── */
  if (confirmation) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f3f4f6]">
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-2xl border border-[#e5e7eb] bg-white p-8 text-center shadow-sm"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">
              This meeting is scheduled
            </h2>
            <p className="mt-2 text-sm text-[#6b7280]">
              We sent an email to {confirmation.bookerEmail} with details.
            </p>

            <div className="mt-8 space-y-4 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-5 text-left text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#9ca3af]">
                  Event
                </p>
                <p className="mt-0.5 font-semibold text-[#111827]">
                  {eventType.title}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#9ca3af]">
                  When
                </p>
                <p className="mt-0.5 font-semibold text-[#111827]">
                  {dayjs(confirmation.startTime).format('dddd, MMMM D, YYYY')}
                </p>
                <p className="text-[#6b7280]">
                  {dayjs(confirmation.startTime).format('h:mm A')} –{' '}
                  {dayjs(confirmation.endTime).format('h:mm A')}
                </p>
              </div>
            </div>

            <a
              href={getGoogleCalendarLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#111827] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1f2937]"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Add to Google Calendar
            </a>
            <a
              href={`/book/${eventType.slug}`}
              className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
            >
              Book another time
            </a>
          </motion.div>
        </div>
        <footer className="pb-6 text-center">
          <span className="text-sm font-bold text-[#111827]">Cal.com</span>
        </footer>
      </div>
    )
  }

  /* ───────── Booking Form (after selecting time) ───────── */
  if (selectedTime && selectedDate) {
    return (
      <div className="min-h-screen bg-[#f3f4f6]">
        <div className="flex justify-center px-4 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[820px] overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm"
          >
            <div className="flex flex-col md:flex-row">
              {/* Left: Event Details */}
              <div className="w-full border-b border-[#e5e7eb] p-6 md:w-[300px] md:border-b-0 md:border-r md:p-8">
                <button
                  type="button"
                  onClick={() => setSelectedTime(null)}
                  className="mb-4 inline-flex items-center text-sm text-[#6b7280] transition-colors hover:text-[#111827]"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back
                </button>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5e7eb]">
                  <User className="h-5 w-5 text-[#6b7280]" />
                </div>
                <p className="mt-3 text-sm text-[#6b7280]">Event Host</p>
                <h1 className="mt-1 text-xl font-bold text-[#111827]">
                  {eventType.title}
                </h1>
                {eventType.description && (
                  <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
                    {eventType.description}
                  </p>
                )}

                <div className="mt-6 space-y-2.5 text-sm text-[#374151]">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#6b7280]" />
                    <span>{eventType.duration}m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-[#6b7280]" />
                    <span>Google Meet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#6b7280]" />
                    <span>
                      {dayjs(selectedDate).format('dddd, MMMM D, YYYY')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#6b7280]" />
                    <span>{formatSlotTime(selectedTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#6b7280]" />
                    <span className="text-xs">{tz}</span>
                  </div>
                </div>
              </div>

              {/* Right: Booking Form */}
              <div className="flex-1 p-6 md:p-8">
                <h2 className="text-base font-bold text-[#111827]">
                  Your details
                </h2>
                <p className="mt-1 text-sm text-[#6b7280]">
                  We&apos;ll send a calendar invite to your email.
                </p>

                {error && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label
                      htmlFor="bookerName"
                      className="mb-1.5 block text-sm font-medium text-[#374151]"
                    >
                      Your name *
                    </label>
                    <input
                      id="bookerName"
                      type="text"
                      value={bookerName}
                      onChange={(e) => setBookerName(e.target.value)}
                      required
                      placeholder="Jane Doe"
                      className="block w-full rounded-lg border border-[#d1d5db] px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition-colors focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bookerEmail"
                      className="mb-1.5 block text-sm font-medium text-[#374151]"
                    >
                      Email address *
                    </label>
                    <input
                      id="bookerEmail"
                      type="email"
                      value={bookerEmail}
                      onChange={(e) => setBookerEmail(e.target.value)}
                      required
                      placeholder="jane@company.com"
                      className="block w-full rounded-lg border border-[#d1d5db] px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition-colors focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full rounded-lg bg-[#111827] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1f2937] ${
                      isSubmitting ? 'cursor-not-allowed opacity-70' : ''
                    }`}
                  >
                    {isSubmitting ? 'Scheduling…' : 'Confirm'}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
        <footer className="pb-6 text-center">
          <span className="text-sm font-bold text-[#111827]">Cal.com</span>
        </footer>
      </div>
    )
  }

  /* ───────── Main Calendar View ───────── */
  const availableSlots = slots.filter((s) => s.available)

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="flex justify-center px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[1040px] overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Panel: Event Info */}
            <div className="w-full border-b border-[#e5e7eb] p-6 md:w-[280px] md:border-b-0 md:border-r md:p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5e7eb]">
                <User className="h-5 w-5 text-[#6b7280]" />
              </div>
              <p className="mt-3 text-sm text-[#2563eb]">Event Host</p>
              <h1 className="mt-1 text-xl font-bold text-[#111827]">
                {eventType.title}
              </h1>
              {eventType.description && (
                <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
                  {eventType.description}
                </p>
              )}

              <div className="mt-6 space-y-2.5 text-sm text-[#374151]">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#6b7280]" />
                  <span>{eventType.duration}m</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-[#6b7280]" />
                  <span>Link meeting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#6b7280]" />
                  <span className="flex items-center gap-1 text-xs">
                    {tz}
                    <ChevronDown className="h-3 w-3 text-[#9ca3af]" />
                  </span>
                </div>
              </div>

              {selectedDate && (
                <div className="mt-5 border-t border-[#e5e7eb] pt-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                    <Calendar className="h-4 w-4 text-[#6b7280]" />
                    {dayjs(selectedDate).format('dddd, MMMM D, YYYY')}
                  </div>
                </div>
              )}
            </div>

            {/* Center Panel: Calendar */}
            <div className="flex-1 border-b border-[#e5e7eb] p-6 md:border-b-0 md:p-8">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-bold text-[#111827]">
                  {currentMonth.format('MMMM')}{' '}
                  <span className="font-normal text-[#6b7280]">
                    {currentMonth.format('YYYY')}
                  </span>
                </h2>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(currentMonth.subtract(1, 'month'))
                    }
                    disabled={currentMonth.isBefore(today, 'month')}
                    className={`rounded-md p-1.5 transition-colors ${
                      currentMonth.isBefore(today, 'month')
                        ? 'cursor-not-allowed text-[#d1d5db]'
                        : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(currentMonth.add(1, 'month'))
                    }
                    className="rounded-md p-1.5 text-[#6b7280] transition-colors hover:bg-[#f3f4f6]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(
                  (d) => (
                    <div
                      key={d}
                      className="py-2 text-center text-[11px] font-semibold tracking-wider text-[#6b7280]"
                    >
                      {d}
                    </div>
                  )
                )}
              </div>

              {/* Calendar Grid - Square cells like Cal.com */}
              <div className="grid grid-cols-7">
                {monthDays.map((day, idx) => {
                  if (day === null) {
                    return <div key={`e-${idx}`} className="aspect-square" />
                  }

                  const dateStr = formatDateString(day)
                  const disabled = isDateDisabled(day)
                  const isSelected = selectedDate === dateStr
                  const isToday = dateStr === today.format('YYYY-MM-DD')

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => {
                        if (!disabled) setSelectedDate(dateStr)
                      }}
                      disabled={disabled}
                      className={`relative flex aspect-square flex-col items-center justify-center text-sm font-medium transition-colors ${
                        disabled
                          ? 'cursor-not-allowed text-[#d1d5db]'
                          : isSelected
                            ? 'bg-[#111827] text-white'
                            : !disabled
                              ? 'bg-[#f3f4f6] text-[#111827] hover:bg-[#e5e7eb]'
                              : 'text-[#374151]'
                      }`}
                      style={{ margin: '1px' }}
                    >
                      {day}
                      {isToday && isSelected && (
                        <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-white" />
                      )}
                      {isToday && !isSelected && (
                        <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-[#111827]" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right Panel: Time Slots (visible when date selected) */}
            <AnimatePresence>
              {selectedDate && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="hidden overflow-hidden border-l border-[#e5e7eb] md:block"
                >
                  <div className="w-[220px] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-bold text-[#111827]">
                        {dayjs(selectedDate).format('ddd')}{' '}
                        <span className="text-[#111827]">
                          {dayjs(selectedDate).format('D')}
                        </span>
                      </p>
                    </div>

                    {loadingSlots ? (
                      <div className="flex justify-center py-10">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#111827]" />
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <p className="py-6 text-center text-sm text-[#9ca3af]">
                        No availability
                      </p>
                    ) : (
                      <div className="flex max-h-[400px] flex-col gap-2 overflow-y-auto pr-1">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => setSelectedTime(slot.time)}
                            className="w-full rounded-lg border border-[#e5e7eb] py-2 text-center text-sm font-medium text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#f9fafb]"
                          >
                            {formatSlotTime(slot.time)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile: Time Slots (below calendar on small screens) */}
          {selectedDate && (
            <div className="border-t border-[#e5e7eb] p-4 md:hidden">
              <p className="mb-3 text-sm font-bold text-[#111827]">
                {dayjs(selectedDate).format('ddd D')}
              </p>
              {loadingSlots ? (
                <div className="flex justify-center py-6">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#111827]" />
                </div>
              ) : availableSlots.length === 0 ? (
                <p className="py-4 text-center text-sm text-[#9ca3af]">
                  No availability
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setSelectedTime(slot.time)}
                      className="rounded-lg border border-[#e5e7eb] py-2 text-center text-sm font-medium text-[#111827] transition-colors hover:border-[#111827]"
                    >
                      {formatSlotTime(slot.time)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Cal.com Footer */}
      <footer className="pb-6 text-center">
        <span className="text-sm font-bold text-[#111827]">Cal.com</span>
      </footer>
    </div>
  )
}
