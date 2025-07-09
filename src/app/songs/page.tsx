'use client';

import SongCardList from '@/components/SongCardList';
import { fetchAllSongs } from '@/services/musicService';
import React, { useEffect, useState } from 'react';

export default function page() {
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
                        onPress={() => console.log(`Playing song: ${song.title}`)}
                        type="default"
                    />
                ))}
            </ul>
        </div>
    );
}
