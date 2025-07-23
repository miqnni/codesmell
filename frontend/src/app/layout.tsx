import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider"
import Header from "@/components/layout/Header";
import { Box, Center, Container } from "@chakra-ui/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeSmell",
  description: "Learn refactoring with CodeSmell!",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>
          <Box p={0} m={0} minH="100vh" w="100vw">
            <Header />
            <Box as="main" w="100%" minH="100dvh" px={10} pt={24} pb={10}>{children}</Box>
          </Box>
        </Provider>
      </body>
    </html>
  )
}
