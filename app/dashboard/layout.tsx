'use client';

import SidebarNav from "../components/sidebarNav";
import { useUser } from "./lib/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user === null) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="dashboard">
        <SidebarNav />
        <main>
          <p>Loading session...</p>
        </main>
      </div>
    );
  }

  if (user === null) {
    return null; // Or something fallback-y
  }

  return (
    <div className="dashboard">
      <SidebarNav />
      <main>{children}</main>
    </div>
  );
}