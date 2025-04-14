import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: 'Login | Intermed Systems',
    description: 'Login page for Intermed System'
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="p-20">
        {children}
    </div>
  );
}
