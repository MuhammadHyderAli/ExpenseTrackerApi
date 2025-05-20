import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track your expenses and categories easily',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 font-sans">
        <main className="max-w-3xl mx-auto py-10 px-4">
          {children}
        </main>
      </body>
    </html>
  )
}
