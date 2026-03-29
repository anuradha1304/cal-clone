import Sidebar from '@/components/Sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4f6] md:flex-row">
      <Sidebar />
      <main className="w-full flex-1 pt-14 md:pt-0">
        <div className="min-h-full bg-white md:bg-[#f3f4f6]">{children}</div>
      </main>
    </div>
  )
}
