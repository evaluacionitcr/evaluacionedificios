import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { esES } from "@clerk/localizations"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Evaluación de Edificios",
  description: "Sistema para la gestión y evaluación de edificios universitarios",
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <ClerkProvider afterSignOutUrl={"/sign-in"} localization={esES}>
        <body className={`${inter.className} bg-gray-50 min-h-screen`}>{children}</body>
      </ClerkProvider>
    </html>
  )
}

