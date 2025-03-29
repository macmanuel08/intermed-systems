'use client';

import { useRouter } from 'next/navigation';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      alert(data.message);
    }
  }

  return (
    <button onClick={handleLogout} className='logout-btn primary-btn'>
      <ArrowRightStartOnRectangleIcon />
      Logout
    </button>
  );
}
