'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchAlbumById } from '@/services/musicService';
import SongCardList from '@/components/SongCardList';

export default function AlbumDetailPage() {
    const params = useParams();
    const router = useRouter();

    // 👇 Retain state
    const [album, setAlbum] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            // 👇 ID and slug parsing EXACTLY as you had it (for full compatibility)
            const slug = Array.isArray(params) ? params[0] : params;
            // If your old code used a special key, e.g. slug.id, adapt as needed
            const id = slug?.id ? slug.id.split('-').pop() : (typeof slug === 'string' ? slug.split('-').pop() : undefined);
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                const albumObj = await fetchAlbumById(id);
                setAlbum(albumObj);
            } catch (err) {
                setAlbum(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [params]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-400">
                Loading album details...
            </div>
        );
    }

    if (!album) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500 font-semibold">
                Album not found.
            </div>
        );
    }

    // Use best available cover
    const coverImg =
        album.cover_url ||
        album['cover_url'] ||
        album['cover-image'] || // just in case
        album?.album_song?.[0]?.songs?.coverUrl ||
        '/album-fallback.png';

    const songs = album.album_song
        ? album.album_song.map((songRel: any) => songRel.songs)
        : [];

    return (
        <main className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
                {/* Album Banner */}
                <div className="flex flex-col md:flex-row items-center gap-8 p-8">
                    <div className="w-48 h-48 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center shadow">
                        <img
                            src={coverImg}
                            alt={album.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl font-bold text-gray-800 truncate">{album.name}</h1>
                        {album.description && (
                            <p className="text-gray-600 mt-2 mb-4">{album.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mb-4">
                            {songs.length} {songs.length === 1 ? 'song' : 'songs'}
                        </p>
                        <button
                            className="mt-2 inline-block bg-blue-500 text-white px-6 py-1.5 rounded hover:bg-blue-600 text-sm font-semibold transition"
                            onClick={() => router.back()}
                        >
                            ← Back to Albums
                        </button>
                    </div>
                </div>

                {/* Song List */}
                <section className="px-8 pb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Songs in this album</h2>
                    {songs.length === 0 ? (
                        <div className="text-gray-400 text-center py-10">
                            No songs are linked to this album yet.
                        </div>
                    ) : (
                        <ul className="grid gap-4">
                            {songs.map((song: any) => (
                                <SongCardList
                                    key={song.id}
                                    song={song}
                                    onPress={() =>
                                        router.push(`/songs/${song.title.replace(/\s+/g, '-')}-${song.id}`)
                                    }
                                    type="default"
                                />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}
