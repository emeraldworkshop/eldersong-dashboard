'use client';

import Link from 'next/link';

export default function Home() {

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Welcome to the Music Dashboard
      </h1>
      <Link href="/songs" className="text-blue-500 underline block">
        View All Songs
      </Link>

      <Link href="/albums" className="text-blue-500 underline block">
        View All Albums
      </Link>

      <Link href="/users" className="text-blue-500 underline block">
        View All Users
      </Link>

    </div>
  );
}
