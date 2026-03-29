'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Info, Sparkles } from 'lucide-react'
import { fadeInUp, stagger } from './motion-variants'
import { pageContainer } from './marketing-layout'

export function HeroSection() {
  return (
    <section className="relative bg-[#f9f9f9] pt-32 pb-24 md:pt-48 md:pb-32">
      <div className={`relative z-10 ${pageContainer} flex flex-col items-center text-center`}>
        
        {/* Announcement */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-between gap-4 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm text-blue-900"
        >
          <span className="flex items-center gap-2 font-medium">
             Moving from another tool? Book a priority call with our team today.
          </span>
          <a
            href="#"
            className="flex items-center gap-1 font-semibold hover:underline"
          >
            Book a demo <ChevronRight className="h-4 w-4" />
          </a>
        </motion.div>

        {/* Headline block */}
        <div className="max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeInUp}>
              <Link
                href="#"
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300"
              >
                <Sparkles className="h-4 w-4" />
                Cal.com launches v6.3
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            </motion.div>
            
            <motion.h1
              variants={fadeInUp}
              className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-[5rem] md:leading-[1.1]"
            >
              Smarter, simpler scheduling
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-2xl text-lg md:text-xl text-gray-500 font-medium leading-relaxed"
            >
              Effortless scheduling for teams and individuals. Connect your
              calendar, share your link, and let guests book time that works for
              everyone.
            </motion.p>
            
            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            >
              <Link
                href="/event-types"
                className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-black/10 transition-transform hover:scale-105"
              >
                Get started
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
              >
                Talk to sales
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-16 flex flex-col items-center gap-6 text-sm sm:flex-row sm:gap-12"
            >
              <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">
                 Trusted by fast-growing companies around the world
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
