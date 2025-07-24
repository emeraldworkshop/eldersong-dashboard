'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { getStoredSession } from '@/utils/auth'; // permanently commented for now

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add auth check here later if needed.
    // const session = getStoredSession();
    // if (!session) router.push('/login');
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500 text-lg">Checking authentication...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 py-16 px-6">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          🎶 Welcome to your Music Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your songs, albums, and users from one central place.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-4xl mx-auto">
        {/* Card 1: Songs */}
        <Link
          href="/songs"
          className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 text-center border border-gray-200 hover:border-blue-500 group"
        >
          <div className="text-4xl mb-3 transition-transform group-hover:scale-105">🎵</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">All Songs</h2>
          <p className="text-sm text-gray-600">Browse, add, and manage songs</p>
        </Link>

        {/* Card 2: Albums */}
        <Link
          href="/albums"
          className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 text-center border border-gray-200 hover:border-blue-500 group"
        >
          <div className="text-4xl mb-3 transition-transform group-hover:scale-105">💿</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">All Albums</h2>
          <p className="text-sm text-gray-600">Organize and view all albums</p>
        </Link>

        {/* Card 3: Users */}
        <Link
          href="/users"
          className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 text-center border border-gray-200 hover:border-blue-500 group"
        >
          <div className="text-4xl mb-3 transition-transform group-hover:scale-105">👤</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">All Users</h2>
          <p className="text-sm text-gray-600">Manage user accounts and metadata</p>
        </Link>
      </div>
    </main>
  );
}
