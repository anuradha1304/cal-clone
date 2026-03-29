'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { pageContainer } from './marketing-layout'

const testimonials = [
  {
    quote:
      'I finally moved to Cal.com after I could not find how to edit events in the other dashboard.',
    name: 'Ant Wilson',
    role: 'Co-Founder & CTO, Supabase',
  },
  {
    quote:
      'Scheduling is now invisible — our team just shares links and meetings happen.',
    name: 'Sarah Chen',
    role: 'Head of Revenue, PlanetScale',
  },
  {
    quote:
      'The open API and embeds let us ship a branded booking flow in days, not months.',
    name: 'Marcus Johnson',
    role: 'Engineering Lead, Raycast',
  },
]

export function TestimonialsSection() {
  const [index, setIndex] = useState(0)
  const prev = () =>
    setIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1))
  const next = () =>
    setIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1))

  return (
    <section className="bg-gray-50 py-24 md:py-32 border-t border-gray-100">
      <div className={pageContainer}>
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm"
          >
            <User className="h-4 w-4" />
            Testimonials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl leading-tight"
          >
            Don&apos;t just take our word for it
          </motion.h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 leading-relaxed">
            Our users are our best ambassadors. Discover why teams choose Cal for
            scheduling.
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-4xl">
          <div className="rounded-3xl border border-gray-200 bg-white p-10 md:p-14 shadow-sm min-h-[300px] flex flex-col justify-center relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-2xl font-semibold leading-relaxed text-gray-900 md:text-3xl text-center">
                  &ldquo;{testimonials[index].quote}&rdquo;
                </p>
                <div className="mt-12 flex items-center justify-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300" />
                  <div className="text-left">
                    <p className="text-lg font-bold text-gray-900">
                      {testimonials[index].name}
                    </p>
                    <p className="text-base text-gray-500">
                      {testimonials[index].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Controls */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-gray-200 bg-white p-2 shadow-sm">
              <button
                type="button"
                onClick={prev}
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="flex gap-2 px-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={cn(
                      'h-2.5 rounded-full transition-all',
                      i === index ? 'w-8 bg-black' : 'w-2.5 bg-gray-200'
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={next}
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
