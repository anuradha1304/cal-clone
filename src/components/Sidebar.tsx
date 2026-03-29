'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Clock, BookOpen, LayoutGrid, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Event Types', href: '/event-types', icon: LayoutGrid },
  { name: 'Availability', href: '/availability', icon: Clock },
  { name: 'Bookings', href: '/bookings', icon: BookOpen },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Top Header */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#e5e7eb] bg-white px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111827] text-white">
            <Calendar className="h-4 w-4" strokeWidth={2} />
          </div>
          <span className="text-sm font-bold text-[#111827]">Cal.com</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-[#6b7280] transition-colors hover:bg-[#f3f4f6] hover:text-[#111827]"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-screen w-60 flex-col border-r border-[#e5e7eb] bg-white transition-transform duration-200 md:static md:translate-x-0',
          isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-[#e5e7eb] px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111827] text-white">
            <Calendar className="h-4 w-4" strokeWidth={2} />
          </div>
          <span className="text-sm font-bold text-[#111827]">Cal.com</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#f3f4f6] text-[#111827]'
                    : 'text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111827]'
                )}
              >
                <item.icon
                  className={cn(
                    'h-4 w-4',
                    isActive ? 'text-[#111827]' : 'text-[#9ca3af]'
                  )}
                  strokeWidth={1.75}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#e5e7eb] p-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e5e7eb] text-xs font-bold text-[#6b7280]">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#111827]">Admin</p>
              <p className="truncate text-xs text-[#9ca3af]">admin@cal.com</p>
            </div>
          </div>
          <Link
            href="/"
            className="mt-2 block text-center text-xs font-medium text-[#9ca3af] transition-colors hover:text-[#111827]"
          >
            ← Back to site
          </Link>
        </div>
      </aside>
    </>
  )
}
