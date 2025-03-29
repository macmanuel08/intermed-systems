import type { Metadata } from "next";
import SidebarNav from "../components/sidebarNav";

export const metadata: Metadata = {
    title: {
        template: '%s | Dashboard',
        default: 'Intermed Systems'
    }
};

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="dashboard">
        <SidebarNav />
        <main>
            {children}
        </main>
      </div>
    );
  }