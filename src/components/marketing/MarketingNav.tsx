'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'

export function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 tracking-tight">
            Cal.com
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
              Solutions <ChevronDown className="h-4 w-4" />
            </button>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Enterprise
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Cal.ai
            </Link>
            <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
              Developer <ChevronDown className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
              Resources <ChevronDown className="h-4 w-4" />
            </button>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/event-types" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Sign in
          </Link>
          <Link
            href="/event-types"
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            Get started
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="#" className="text-base font-medium text-gray-900">Solutions</Link>
            <Link href="#" className="text-base font-medium text-gray-900">Enterprise</Link>
            <Link href="#" className="text-base font-medium text-gray-900">Cal.ai</Link>
            <Link href="#" className="text-base font-medium text-gray-900">Developer</Link>
            <Link href="#" className="text-base font-medium text-gray-900">Resources</Link>
            <Link href="#" className="text-base font-medium text-gray-900">Pricing</Link>
            <hr className="my-2 border-gray-200" />
            <Link href="/event-types" className="text-base font-medium text-gray-900">Sign in</Link>
            <Link
              href="/event-types"
              className="mt-2 inline-flex justify-center rounded-md bg-black px-4 py-3 text-sm font-medium text-white"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
