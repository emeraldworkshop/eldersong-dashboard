'use client';

import SongCardList from '@/components/SongCardList';
import { fetchAllSongs } from '@/services/musicService';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/utils/createSlug';

export default function page() {
  const router = useRouter();
  const [songs, setSongs] = useState<any[]>([]);

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
      <h1 className="text-2xl font-bold mb-4">All Songs</h1>
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
          />
        ))}
      </ul>
    </div>
  );
}
