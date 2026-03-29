'use client'

import { motion } from 'framer-motion'
import {
  CreditCard,
  Video,
  Link2,
  ShieldCheck,
  Languages,
  AppWindow,
  LayoutGrid,
  SlidersHorizontal,
} from 'lucide-react'
import { pageContainer } from './marketing-layout'

const items = [
  { icon: CreditCard, label: 'Accept payments' },
  { icon: Video, label: 'Built-in video conferencing' },
  { icon: Link2, label: 'Short booking links' },
  { icon: ShieldCheck, label: 'Privacy first' },
  { icon: Languages, label: '65+ languages' },
  { icon: AppWindow, label: 'Easy embeds' },
  { icon: LayoutGrid, label: 'All your favorite apps' },
  { icon: SlidersHorizontal, label: 'Simple customization' },
]

export function MoreFeaturesGrid() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className={pageContainer}>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-4xl text-center text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
        >
          …and so much more!
        </motion.h2>

        <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
          {items.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-gray-50 p-8 text-center transition-transform hover:scale-105 hover:bg-white hover:shadow-lg"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                <Icon className="h-6 w-6 text-gray-900" strokeWidth={2} />
              </div>
              <p className="max-w-[120px] text-base font-bold leading-tight text-gray-900">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
