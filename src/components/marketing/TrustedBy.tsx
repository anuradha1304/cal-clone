'use client'

import { motion } from 'framer-motion'
import { pageContainer } from './marketing-layout'

const brands = [
  'Ramp',
  'PlanetScale',
  'Coinbase',
  'Storyblok',
  'AngelList',
  'Raycast',
]

export function TrustedBy() {
  return (
    <section className="bg-white py-16">
      <div className={pageContainer}>
        <div className="flex flex-col items-center">
          <div className="flex w-full max-w-5xl flex-wrap justify-between gap-x-12 gap-y-10 border-t border-gray-200 pt-16 mt-8 grayscale opacity-50 transition-all hover:grayscale-0 hover:opacity-100">
            {brands.map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="text-2xl font-bold tracking-tight text-gray-800"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
