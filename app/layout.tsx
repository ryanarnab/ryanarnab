import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { CustomCursor } from "./components/CustomCursor";
import { ExperienceProvider } from "./components/ExperienceProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RyanArnab",
  description: "Curiosity Creates Better.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ExperienceProvider>
          <CustomCursor />
          {children}
        </ExperienceProvider>
      </body>
    </html>
  );
}
