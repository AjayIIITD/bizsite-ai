import ThemeProvider from "@/components/shared/ThemeProvider"
import Sidebar from "@/components/shared/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-16 md:ml-64 p-6">{children}</main>
      </div>
    </ThemeProvider>
  )
}
