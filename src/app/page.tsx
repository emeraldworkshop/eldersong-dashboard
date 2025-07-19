'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStoredSession } from '@/utils/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // loading state while checking auth

  useEffect(() => {
    const session = getStoredSession();

    if (!session) {
      router.push('/login'); // 🔒 Redirect to login if not authenticated
    } else {
      setIsLoading(false); // ✅ Show content
    }
  }, [router]);

  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500 text-lg">Checking authentication...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🎵 Welcome to the Music Dashboard
        </h1>

        <div className="space-y-4 text-center">
          <Link href="/songs" className="text-blue-600 hover:underline text-lg block">
            🎶 View All Songs
          </Link>
          <Link href="/albums" className="text-blue-600 hover:underline text-lg block">
            💿 View All Albums
          </Link>
          <Link href="/users" className="text-blue-600 hover:underline text-lg block">
            👤 View All Users
          </Link>
        </div>
      </div>
    </main>
  );
}
