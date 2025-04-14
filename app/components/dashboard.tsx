'use client';

import { useUser } from '../dashboard/lib/userContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
      template: '%s | Dashboard',
      default: 'Intermed Systems'
  }
};

export default function Dashboard() {
  const { user } = useUser();

  return <h1>Welcome, {user?.name}</h1>;
}