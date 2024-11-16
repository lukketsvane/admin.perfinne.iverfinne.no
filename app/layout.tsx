import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import './globals.css'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })

  await supabase.auth.getSession()

  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}