'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchSongById } from '@/services/musicService';

export default function SongDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const slug = params?.id;

      if (!slug || typeof slug !== 'string') return;

      // Extract ID from slug like "/songs/title-of-song-1234"
      const id = slug.split('-').pop();
      if (!id) return;

      const songData = await fetchSongById(id);
      setSong(songData);
      setLoading(false);
    })();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 text-lg">
        Loading song details...
      </div>
    );
  }

  if (!song) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-lg">
        Song not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            ← Back to All Songs
          </button>
        </div>

        {/* Banner Image */}
        <div className="w-full h-72 rounded-lg overflow-hidden mb-6 bg-gray-100">
          <img
            src={song?.coverUrl || '/song-fallback.png'}
            alt={song?.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Song Details */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{song?.title}</h1>
        <p className="text-gray-600 mb-4">
          {typeof song.artist === 'object' ? song.artist.name : song.artist}
        </p>

        {/* Audio Player */}
        <audio controls className="w-full rounded">
          <source src={song?.musicUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </main>
  );
}
