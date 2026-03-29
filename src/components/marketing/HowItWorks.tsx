'use client'

import { motion } from 'framer-motion'
import { fadeInUp, stagger } from './motion-variants'
import { pageContainer } from './marketing-layout'

const steps = [
  {
    n: '01',
    title: 'Connect your calendar',
    desc: 'Sync Google, Outlook, or Apple Calendar so availability stays accurate.',
  },
  {
    n: '02',
    title: 'Set your availability',
    desc: 'Define working hours, buffers, and rules so meetings land when you want them.',
  },
  {
    n: '03',
    title: 'Choose how to meet',
    desc: 'Offer video, phone, or in-person — Cal routes guests to the right experience.',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-white py-24 md:py-32 border-t border-gray-100">
      <div className={pageContainer}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
          >
            With us, appointment scheduling is easy
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-4 max-w-2xl text-lg text-gray-500"
          >
            Powerful scheduling for fast-growing teams — without the busywork.
          </motion.p>
        </motion.div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.article
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
            >
              <div className="text-sm font-semibold text-gray-400 mb-4 tracking-widest">
                {step.n}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-base">
                {step.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
