'use client';

import SongCardList from '@/components/SongCardList';
import { fetchAllAlbums } from '@/services/musicService';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/utils/createSlug';

export default function page() {
    const router = useRouter();
    const [albums, setAllAlbums] = useState<any[]>([]);

    useEffect(() => {
        //show the loading component here later ---

        (async () => {
            const albumList = await fetchAllAlbums();
            if (albumList && albumList.length > 0) {
                console.log('Fetched albums:', albumList);
                setAllAlbums(albumList);
                //remove the loading component here later
            }
        })();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">All albums</h1>
            <ul className="divide-y divide-gray-200">
                {albums.map((album) => (
                    <li
                        key={album.id}
                        className="flex items-start gap-4 p-4 cursor-pointer border-b border-gray-200"
                        onClick={() => {
                            const slug = slugify(album.name);
                            const fullSlug = `${slug}-${album.id}`;
                            router.push(`/albums/${fullSlug}`);
                        }
                        }
                    >
                        {album?.album_song[0]?.songs?.coverUrl ? (
                            <img
                                src={album?.album_song[0].songs?.coverUrl}
                                alt={album.name}
                                className="w-16 h-16 rounded object-cover flex-shrink-0"
                            />
                        ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                No Image
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white">
                                {album.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {album.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {album.album_song.length}{" "}
                                {album.album_song.length === 1 ? "song" : "songs"}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
