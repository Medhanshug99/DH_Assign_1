import type { Metadata } from 'next'
import { Outfit, Geist_Mono } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Fairway Impact | Premium Golf Performance & Charity Platform',
  description: 'Submit your golf scores, win monthly rewards, and contribute to impactful charities through your subscription.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${geistMono.variable} antialiased selection:bg-primary selection:text-black min-h-screen bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}
