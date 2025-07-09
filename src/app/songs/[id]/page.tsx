'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchSongById } from '@/services/musicService';

export default function page() {
  const params = useParams();
  const [song, setSong] = React.useState<any>(null);

  useEffect(() => {
    (async () => {
      const slug = Array.isArray(params) ? params[0] : params;
      console.log('Slug parameter:', slug);

      const id = slug ? slug.id?.split('-').pop() : undefined;

      console.log('Extracted ID from slug:', id);
      const res = await fetchSongById(id);
      if (!res) {
        console.error('No song found with the given ID');
        return;
      }
      setSong(res);

      console.log('Fetched song by ID:', res);
    })();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Banner Image */}
      <div className="w-full h-72 rounded-lg overflow-hidden mb-6">
        <img
          src={song?.coverUrl}
          alt={song?.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Song Details */}
      <h1 className="text-2xl font-bold mb-2">{song?.title}</h1>
      <p className="text-gray-600 mb-6">{song?.artist}</p>

      {/* Audio Player */}
      <audio controls className="w-full rounded">
        <source src={song?.audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
