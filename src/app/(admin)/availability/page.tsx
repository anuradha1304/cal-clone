'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

// Generate 00:00 to 23:30 in 30min intervals
const TIME_SLOTS: string[] = []
for (let h = 0; h < 24; h++) {
  TIME_SLOTS.push(`${h.toString().padStart(2, '0')}:00`)
  TIME_SLOTS.push(`${h.toString().padStart(2, '0')}:30`)
}

// We can get timezones from Intl directly, but default to user's timezone if possible
const TIMEZONES = Intl.supportedValuesOf('timeZone')

type DaySchedule = {
  dayOfWeek: number
  enabled: boolean
  startTime: string
  endTime: string
}

export default function AvailabilityPage() {
  const router = useRouter()
  const [schedule, setSchedule] = useState<DaySchedule[]>([])
  const [timezone, setTimezone] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    // Determine user's current timezone as default
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setTimezone(userTimezone)

    // Initialize default schedule layout
    const initialSchedule: DaySchedule[] = Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      enabled: false,
      startTime: '09:00',
      endTime: '17:00',
    }))

    // Fetch existing settings
    async function fetchAvailability() {
      try {
        const res = await fetch('/api/availability')
        if (!res.ok) throw new Error('Failed to fetch availability')

        const data = await res.json()

        if (data.length > 0) {
          // If we have saved data, update timezone from the first record
          setTimezone(data[0].timezone)

          // Merge saved data into our 7-day structure
          const updatedSchedule = initialSchedule.map((day) => {
            const savedDay = data.find((d: any) => d.dayOfWeek === day.dayOfWeek)
            if (savedDay) {
              return {
                ...day,
                enabled: true,
                startTime: savedDay.startTime,
                endTime: savedDay.endTime,
              }
            }
            return day
          })
          setSchedule(updatedSchedule)
        } else {
          // No data saved yet, let's enable Monday-Friday 9to5 by default
          const defaultSchedule = initialSchedule.map((day) => ({
            ...day,
            enabled: day.dayOfWeek >= 1 && day.dayOfWeek <= 5, // Mon-Fri
          }))
          setSchedule(defaultSchedule)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvailability()
  }, [])

  const handleToggle = (dayIndex: number) => {
    setSchedule((prev) =>
      prev.map((day, idx) =>
        idx === dayIndex ? { ...day, enabled: !day.enabled } : day
      )
    )
    setSuccess(null)
  }

  const handleTimeChange = (dayIndex: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule((prev) =>
      prev.map((day, idx) =>
        idx === dayIndex ? { ...day, [field]: value } : day
      )
    )
    setSuccess(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    // Filter down to only enabled days
    const activeSchedule = schedule.filter((day) => day.enabled)

    // Transform for the API
    const payload = activeSchedule.map((day) => ({
      dayOfWeek: day.dayOfWeek,
      startTime: day.startTime,
      endTime: day.endTime,
      timezone: timezone,
    }))

    try {
      const res = await fetch('/api/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to save availability')
      }

      setSuccess('Availability updated successfully')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex h-[60vh] max-w-4xl items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#111827]" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Availability</h1>
          <p className="mt-1 text-sm text-[#6b7280]">Configure your default weekly schedule.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`inline-flex items-center justify-center rounded-lg bg-[#111827] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1f2937] ${
            isSaving ? 'cursor-not-allowed opacity-70' : ''
          }`}
        >
          {isSaving ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#6b7280] border-t-white" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="mb-8 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#e5e7eb] bg-[#f9fafb] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-medium text-[#111827]">Timezone</h3>
            <p className="mt-1 text-xs text-[#6b7280]">Required for accurate bookings.</p>
          </div>
          <div className="w-full sm:w-64">
            <select
              value={timezone}
              onChange={(e) => {
                setTimezone(e.target.value)
                setSuccess(null)
              }}
              className="block w-full rounded-lg border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] outline-none transition-colors focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-[#e5e7eb]">
          {schedule.map((day, idx) => (
            <div key={idx} className="flex flex-col gap-4 p-5 transition-colors hover:bg-[#f9fafb] sm:flex-row sm:items-center">
              <div className="flex w-48 shrink-0 items-center">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={day.enabled}
                    onChange={() => handleToggle(idx)}
                  />
                  <div className="peer h-5 w-9 rounded-full bg-[#d1d5db] after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-[#d1d5db] after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#111827] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
                </label>
                <span className={`ml-4 text-sm font-medium ${day.enabled ? 'text-[#111827]' : 'text-[#9ca3af]'}`}>
                  {DAYS_OF_WEEK[day.dayOfWeek]}
                </span>
              </div>

              <div className="flex flex-1 items-center">
                {day.enabled ? (
                  <div className="flex items-center gap-3">
                    <select
                      value={day.startTime}
                      onChange={(e) => handleTimeChange(idx, 'startTime', e.target.value)}
                      className="block w-[110px] rounded-lg border border-[#d1d5db] px-3 py-2 text-sm text-[#111827] outline-none transition-colors focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
                    >
                      {TIME_SLOTS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm text-[#9ca3af]">-</span>
                    <select
                      value={day.endTime}
                      onChange={(e) => handleTimeChange(idx, 'endTime', e.target.value)}
                      className="block w-[110px] rounded-lg border border-[#d1d5db] px-3 py-2 text-sm text-[#111827] outline-none transition-colors focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
                    >
                      {TIME_SLOTS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span className="text-sm text-[#9ca3af]">Unavailable</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
