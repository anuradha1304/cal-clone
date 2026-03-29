'use client'

import { motion } from 'framer-motion'
import { fadeInUp } from './motion-variants'
import { pageContainer } from './marketing-layout'

const cards = [
  {
    title: 'Avoid meeting overload',
    body: 'Minimum notice, buffers, and limits keep your day under control.',
  },
  {
    title: 'Stand out with a custom booking link',
    body: 'A branded short link that feels like your company — not a generic tool.',
  },
  {
    title: "Streamline your bookers' experience",
    body: 'Time zone aware, clear confirmations, and fewer back-and-forth emails.',
  },
  {
    title: 'Reduce no-shows with reminders',
    body: 'Email and SMS reminders so your guests show up prepared.',
  },
]

export function FeatureBento() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className={pageContainer}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl leading-tight">
            Built for teams who live in their calendar
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 leading-relaxed">
            Everything you need to schedule, host, and follow up — in one place.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-8 md:grid-cols-2">
          {cards.map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-gray-50/50 p-10 shadow-sm"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {card.title}
              </h3>
              <p className="text-lg text-gray-500 leading-relaxed flex-1">
                {card.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
