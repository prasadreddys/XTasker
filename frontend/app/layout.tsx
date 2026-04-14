import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'XTasker - X Engagement Marketplace',
  description: 'Earn money by completing X engagement tasks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
