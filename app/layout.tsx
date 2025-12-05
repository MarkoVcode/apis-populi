import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "APIs Populi - REST APIs for Everyone",
  description: "A collection of 5 RESTful APIs for testing and learning: Flights, Books, Warehouse, School, and Space. Features real-world data, multiple authentication methods, and comprehensive documentation.",
  keywords: ["REST API", "testing", "mock API", "learning", "flights", "books", "warehouse", "school", "space"],
  authors: [{ name: "APIs Populi" }],
  openGraph: {
    title: "APIs Populi - REST APIs for Everyone",
    description: "A collection of 5 RESTful APIs for testing and learning",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
