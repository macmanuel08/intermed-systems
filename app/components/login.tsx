'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from './input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage(null);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      const data = await res.json();
      setMessage(data.message || 'Login failed. Please try again.');
    }
  }

  return (
    <>
      <form onSubmit={handleLogin}>
        {message && <p className="error-message margin-bottom-2">{message}</p>}
        <Input 
          type="email" 
          label="Enter your email" 
          name="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email"
        />
        <Input
          type="password"
          label="Enter your password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className='primary-btn mx-auto' type='submit'>Login</button>
      </form>
      <a className='secondary-btn margin-top-2 mx-auto' href="#">Create Account</a>
    </>
  );
}
