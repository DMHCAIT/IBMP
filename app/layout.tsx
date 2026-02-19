import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ContentProvider } from "@/lib/content-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "IBMP - International Board of Medical Practitioners",
  description: "Providing high-quality accreditation services for medical education providers and medical learning programs worldwide. Globally recognized medical accreditation authority.",
  keywords: "medical accreditation, healthcare certification, medical education, IBMP, medical practitioners, global accreditation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ContentProvider>
          {children}
        </ContentProvider>
      </body>
    </html>
  );
}
