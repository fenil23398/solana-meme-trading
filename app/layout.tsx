import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google"

import "./globals.css"
import { AppProviders } from "@/components/providers/app-providers"
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
  title: {
    default: "fomo.family — where traders become legends",
    template: "%s | fomo.family",
  },
  description:
    "fomo.family is the #1 social Solana trading app. Hunt memecoins, follow top traders, climb the leaderboard. Trade in seconds — never miss another pump.",
  keywords: [
    "fomo.family",
    "Solana trading app",
    "memecoin trading",
    "social trading",
    "Solana memecoins",
    "crypto trading app",
    "Solana wallet",
    "token trading",
    "fomo family",
  ],
  authors: [{ name: "fomo.family", url: "https://fomo.family" }],
  creator: "fomo.family",
  metadataBase: new URL("https://fomo.family"),
  alternates: { canonical: "https://fomo.family" },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    type: "website",
    url: "https://fomo.family",
    siteName: "fomo.family",
    title: "fomo.family — where traders become legends",
    description:
      "Hunt every memecoin on Solana. Trade in seconds, climb the leaderboard, become a name everyone knows.",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "fomo.family — Social Solana Trading App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@fomo",
    creator: "@fomo",
    title: "fomo.family — where traders become legends",
    description:
      "The #1 social Solana trading app. Hunt memecoins, follow top traders, climb the leaderboard.",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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
        <AppProviders>
          <ThemeProvider defaultTheme="dark" forcedTheme="dark">
            {children}
          </ThemeProvider>
        </AppProviders>
      </body>
    </html>
  )
}
