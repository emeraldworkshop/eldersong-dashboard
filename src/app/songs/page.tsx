'use client';

import SongCardList from '@/components/SongCardList';
import { fetchAllSongs } from '@/services/musicService';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/utils/createSlug';
import { deleteSong } from '@/utils/deleteSong';

export default function page() {
  const router = useRouter();
  const [songs, setSongs] = useState<any[]>([]);

  const handleDelete = async (song: any) => {
    const confirmDelete = confirm(`Are you sure you want to delete "${song.title}"?`);
    if (!confirmDelete) return;

    const res = await deleteSong(song.id, song.cover_path, song.music_path);

    if (res.success) {
      setSongs((prev) => prev.filter((s) => s.id !== song.id));
      if (res.warnings) {
        alert('Song deleted, but some storage files were not removed:\n' + res.warnings.join('\n'));
      } else {
        alert('Song deleted successfully.');
      }
    } else {
      alert('Failed to delete song. Check console.');
    }
  };

  useEffect(() => {
    //show the loading component here later ---
    (async () => {
      const songList = await fetchAllSongs();
      if (songList && songList.length > 0) {
        console.log('Fetched songs:', songList);
        setSongs(songList);

        //remove the loading component here later
      }
    })();
  }, []);


  return (
    <div>
      <section className='max-w-5xl mx-auto p-8 flex justify-between items-center *:flex-col md:flex-row'>
        <h1 className="text-2xl font-bold mb-4">All Songs</h1>

        <button
          onClick={() => router.push('/addSong')}
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Song
        </button>
      </section>
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
            type="default"
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}
