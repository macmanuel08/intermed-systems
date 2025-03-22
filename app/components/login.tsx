'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      // Redirect to the dashboard if login is successful
      router.push('/dashboard');
    } else {
      const data = await res.json();
      alert(data.message); // Show error message if login fails
    }
  }

  return (
    <>
      <form onSubmit={handleLogin}>
        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
        <button type='submit'>Login</button>
      </form>
      <a href="#">Create Account</a>
    </>
  );
}
