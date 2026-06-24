import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "ChadWallet | The #1 meme coing trading app!",
  description:
    "Where traders become legends. Hunt every memecoin on Solana — buy, send, and launch from one wallet.",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "ChadWallet | Social Solana Trading App",
    description:
      "Where traders become legends. Hunt every memecoin on Solana in seconds.",
    images: ["/images/logo.png"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "dark antialiased",
        inter.variable,
        plusJakarta.variable,
        jetbrainsMono.variable
      )}
    >
      <body className="bg-[#080404] font-sans text-white">
        <ThemeProvider defaultTheme="dark" forcedTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
