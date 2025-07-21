'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchAlbumById } from '@/services/musicService';
import { deleteAlbumById } from '@/utils/album';
import SongCardList from '@/components/SongCardList';
import { slugify } from '@/utils/createSlug';

export default function AlbumDetailPage() {
    const params = useParams();
    const router = useRouter();

    const [album, setAlbum] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [albumId, setAlbumId] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            const slugParam = params?.id;

            if (!slugParam || typeof slugParam !== 'string') {
                console.warn('Slug not found in route.');
                setLoading(false);
                return;
            }

            const idStr = slugParam.split('-').pop();
            const id = Number(idStr);

            if (!id) {
                setLoading(false);
                return;
            }

            setAlbumId(id);

            try {
                const albumObj = await fetchAlbumById(id);
                setAlbum(albumObj);
            } catch (err) {
                console.error('Failed to fetch album', err);
                setAlbum(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [params]);

    const handleDelete = async () => {
        if (!albumId || !album?.name) return;

        const confirmDelete = confirm(`Are you sure you want to delete "${album.name}"?`);
        if (!confirmDelete) return;

        const result = await deleteAlbumById(albumId);

        if (result.success) {
            // Redirect to albums list
            router.push('/albums');
        } else {
            alert(`❌ Failed to delete: ${result.message}`);
        }
    };

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

    const songs = album.album_song ? album.album_song.map((songRel: any) => songRel.songs) : [];
    const albumSlug = `${slugify(album.name)}-${album.id}`;

    return (
        <main className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
                {/* Album Banner */}
                <div className="flex flex-col md:flex-row items-center gap-8 p-8">
                    <div className="w-48 h-48 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center shadow">
                        <img
                            src={album['cover_url'] || album.cover_image || '/album-fallback.png'}
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

                        <div className="flex gap-3 flex-wrap">
                            {/* Back */}
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-1.5 rounded hover:bg-gray-400 text-sm font-semibold transition"
                                onClick={() => router.back()}
                            >
                                ← Back to Albums
                            </button>

                            {/* Edit */}
                            <button
                                className="bg-blue-600 text-white px-5 py-1.5 rounded hover:bg-blue-700 text-sm font-semibold transition"
                                onClick={() => router.push(`/albums/${albumSlug}/edit`)}
                            >
                                ✏️ Edit Album
                            </button>

                            {/* 🔴 Delete Button */}
                            <button
                                className="bg-red-600 text-white px-5 py-1.5 rounded hover:bg-red-700 text-sm font-semibold transition"
                                onClick={handleDelete}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                </div>

                {/* Songs List */}
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
