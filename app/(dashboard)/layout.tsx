import ThemeProvider from "@/components/shared/ThemeProvider"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">{children}</div>
    </ThemeProvider>
  )
}
