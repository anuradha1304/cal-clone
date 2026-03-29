import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.booking.deleteMany()
  await prisma.eventType.deleteMany()
  await prisma.availability.deleteMany()

  const meeting15 = await prisma.eventType.create({
    data: { title: '15 Minute Meeting', description: 'A quick 15 minute chat', duration: 15, slug: '15min' },
  })
  const meeting30 = await prisma.eventType.create({
    data: { title: '30 Minute Meeting', description: 'A standard 30 minute meeting', duration: 30, slug: '30min' },
  })
  await prisma.eventType.create({
    data: { title: '1 Hour Meeting', description: 'A detailed 1 hour session', duration: 60, slug: '1hour' },
  })

  for (const day of [1, 2, 3, 4, 5]) {
    await prisma.availability.create({
      data: { dayOfWeek: day, startTime: '09:00', endTime: '17:00', timezone: 'Asia/Kolkata' },
    })
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(10, 0, 0, 0)
  const tomorrowEnd = new Date(tomorrow)
  tomorrowEnd.setMinutes(30)

  await prisma.booking.create({
    data: { eventTypeId: meeting15.id, bookerName: 'John Doe', bookerEmail: 'john@example.com', startTime: tomorrow, endTime: tomorrowEnd, status: 'confirmed' },
  })

  const dayAfter = new Date()
  dayAfter.setDate(dayAfter.getDate() + 2)
  dayAfter.setHours(14, 0, 0, 0)
  const dayAfterEnd = new Date(dayAfter)
  dayAfterEnd.setMinutes(30)

  await prisma.booking.create({
    data: { eventTypeId: meeting30.id, bookerName: 'Jane Smith', bookerEmail: 'jane@example.com', startTime: dayAfter, endTime: dayAfterEnd, status: 'confirmed' },
  })

  console.log('✅ Database seeded successfully!')
}

main().catch(console.error).finally(() => prisma.$disconnect())