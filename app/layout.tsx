import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import './globals.css'

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })

  try {
    await supabase.auth.getSession()
  } catch (error) {
    console.error('Error getting session:', error)
  }

  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}