'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch('/api/auth/session');
  
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        router.push('/login');
      }
    }
    fetchSession();
  }, [router]);  
  console.log(user);
  if (user != null) {
    console.log(user.name)
    return <h1 key={user.name}>Welcome, {user.name}</h1>
  }

  return <p>Loading...</p>;
}