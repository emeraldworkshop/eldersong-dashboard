'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchAlbumById } from '@/services/musicService';
import { useRouter } from 'next/navigation';
import SongCardList from '@/components/SongCardList';
import { slugify } from '@/utils/createSlug';

export default function page() {
    const params = useParams();
    const router = useRouter();
    const [album, setAlbum] = React.useState<any>(null);

    useEffect(() => {
        (async () => {
            const slug = Array.isArray(params) ? params[0] : params;
            console.log('Slug parameter:', slug);

            const id = slug ? slug.id?.split('-').pop() : undefined;

            const res = await fetchAlbumById(id);
            if (!res) {
                console.error('No song found with the given ID');
                return;
            }
            setAlbum(res);

            console.log('Fetched song by ID:', res);
        })();
    }, []);

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Album Banner */}
            {/* <div className="w-full h-72 rounded-lg overflow-hidden mb-6">
                <img
                    src={album?.album_songs[0]?.songs?.coverUrl}
                    alt={album?.title}
                    className="w-full h-full object-cover"
                />
            </div> */}

            {/* Album Details */}
            <h1 className="text-3xl font-bold mb-2">{album?.name}</h1>
            <p className="text-gray-600 mb-4">{album?.description}</p>
            <p className="text-sm text-gray-400 mb-8">
                {album?.album_song.length}{' '}
                {album?.album_song.length === 1 ? 'song' : 'songs'}
            </p>

            {/* Song List */}
            <ul className="space-y-4">
                {album?.album_song.map((song: any) => (
                    <SongCardList
                        song={song.songs}
                        onPress={() => { 
                            const slug = slugify(song.songs.title);
                            const fullSlug = `${slug}-${song.songs.id}`;
                            router.push(`/songs/${fullSlug}`);
                         }}
                        type="default"
                    />
                ))}
            </ul>
        </div>
    );
}
