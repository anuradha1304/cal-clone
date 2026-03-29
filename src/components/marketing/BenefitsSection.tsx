'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Layers } from 'lucide-react'
import { fadeInUp, stagger } from './motion-variants'
import { pageContainer } from './marketing-layout'

export function BenefitsSection() {
  return (
    <section className="bg-[#f9f9f9] py-24 md:py-32">
      <div className={pageContainer}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-8 inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm"
          >
            <Layers className="h-4 w-4" />
            Benefits
          </motion.div>
          
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-bold tracking-tight text-gray-900 md:text-[4rem] leading-[1.1]"
          >
            Your all-purpose scheduling app
          </motion.h2>
          
          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 leading-relaxed"
          >
            Discover advanced features for teams and individuals. Unlimited free
            tier for personal use.
          </motion.p>
          
          <motion.div
            variants={fadeInUp}
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row justify-center"
          >
            <Link
              href="/event-types"
              className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105"
            >
              Get started
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
            >
              Book a demo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
