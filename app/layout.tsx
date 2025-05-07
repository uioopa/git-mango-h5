import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { CVProvider } from "@/lib/cv-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Git Mango",
  description: "Create professional CVs with GitHub integration",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CVProvider>
          {children}
          <Toaster />
        </CVProvider>
      </body>
    </html>
  )
}
