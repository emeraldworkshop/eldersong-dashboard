'use client';

import SongCardList from '@/components/SongCardList';
import { fetchAllSongs } from '@/services/musicService';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/utils/createSlug';
import { deleteSong } from '@/utils/deleteSong';

export default function AllSongsPage() {
  const router = useRouter();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (song: any) => {
    const confirmDelete = confirm(`Are you sure you want to delete "${song.title}"?`);
    if (!confirmDelete) return;

    const res = await deleteSong(song.id, song.cover_path, song.music_path);

    if (res.success) {
      setSongs((prev) => prev.filter((s) => s.id !== song.id));
      if (res.warnings?.length) {
        alert('Song deleted, but some storage files were not removed:\n' + res.warnings.join('\n'));
      } else {
        alert('✅ Song deleted successfully.');
      }
    } else {
      alert('❌ Failed to delete song. Check console.');
    }
  };

  useEffect(() => {
    (async () => {
      const songList = await fetchAllSongs();
      if (songList && songList.length > 0) {
        console.log('Fetched songs:', songList);
        setSongs(songList);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🎶 All Songs</h1>
        <button
          onClick={() => router.push('/addSong')}
          type="button"
          className="mt-4 md:mt-0 bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
        >
          ➕ Add Song
        </button>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-400 py-16">Loading songs...</p>
        ) : songs.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No songs found.</p>
        ) : (
          <ul className="space-y-4">
            {songs.map((song) => (
              <SongCardList
                key={song.id}
                song={song}
                onPress={() => {
                  const slug = slugify(song.title);
                  const fullSlug = `${slug}-${song.id}`;
                  router.push(`/songs/${fullSlug}`);
                }}
                onDelete={handleDelete}
                onEdit={(s) =>
                  router.push(`/songs/${slugify(s.title)}-${s.id}/edit`)
                }
                type="default"
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
