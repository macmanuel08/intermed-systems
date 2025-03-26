import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "300","400"]
});

export const metadata: Metadata = {
  title: "Intermed Systems",
  description: "Ease your admin works",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
