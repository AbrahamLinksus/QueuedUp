import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Bangers, DM_Sans } from "next/font/google";
import { Nav } from "@/components/nav";
import { PageTransition } from "@/components/page-transition";
import "./globals.css";

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111111",
};

export const metadata: Metadata = {
  title: "QueuedUp",
  description: "Personal DSA practice journal with spaced-repetition review.",
  icons: {
    icon: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "QueuedUp",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bangers.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js')` }} />
        <main className="mx-auto w-full max-w-md md:max-w-5xl flex-1 px-4 md:px-8 pb-32 pt-8">
          <PageTransition>{children}</PageTransition>
        </main>
        <Suspense>
          <Nav />
        </Suspense>
      </body>
    </html>
  );
}
