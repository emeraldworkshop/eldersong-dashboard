'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAllAlbums } from '@/services/musicService';
import { slugify } from '@/utils/createSlug';
import { log } from 'console';

export default function AlbumsPage() {
    const router = useRouter();
    const [albums, setAllAlbums] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const albumList = await fetchAllAlbums();

                console.log({albumList});
                
                setAllAlbums(albumList || []);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <main className="min-h-screen bg-gray-100 py-10 px-4">
            {/* Header */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center border-b pb-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">💿 All Albums</h1>
                    <p className="text-gray-600 mt-2">Browse all your music albums.</p>
                </div>
                <button
                    onClick={() => router.push('/addAlbum')}
                    className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-md shadow transition"
                >
                    ➕ Add Album
                </button>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex items-center justify-center py-20 text-gray-400">
                    Loading albums...
                </div>
            )}

            {/* Empty state */}
            {!loading && albums.length === 0 && (
                <div className="text-center text-gray-400 text-lg mt-10">
                    No albums found.
                </div>
            )}

            {/* Album grid */}
            {!loading && albums.length > 0 && (
                <ul className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto">
                    {albums.map((album) => {
                        // Determine cover image: own, or first song, or fallback
                        const coverImg = album['cover-image'] !==null ? 
                            album['cover_url'] :
                            album?.album_song[0].songs?.coverUrl;

                        return (
                            <li
                                key={album.id}
                                className="group bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer flex flex-col h-full"
                                onClick={() => {
                                    const slug = slugify(album.name);
                                    const fullSlug = `${slug}-${album.id}`;
                                    router.push(`/albums/${fullSlug}`);
                                }}
                            >
                                {/* Cover Image */}
                                <div className="w-full h-44 rounded-t-xl overflow-hidden bg-gray-200 flex items-center justify-center">
                                    <img
                                        src={coverImg}
                                        alt={album.name}
                                        className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                                    />
                                </div>
                                {/* Album Info */}
                                <div className="flex-1 flex flex-col justify-between p-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 truncate">{album.name}</h3>
                                        {album.description && (
                                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{album.description}</p>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3">
                                        {album.album_song?.length || 0}{' '}
                                        {album.album_song?.length === 1 ? 'song' : 'songs'}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </main>
    );
}
