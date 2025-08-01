'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { updateSong } from '@/utils/song';
import { fetchSongById } from '@/services/musicService';

export default function EditSongPage() {
    const params = useParams();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [albums, setAlbums] = useState([]);
    const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([]);
    const [songId, setSongId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Utility to normalize all IDs as strings
    const normalizeId = (id: string | number) => id.toString();

    useEffect(() => {
        const loadSong = async () => {
            const slugParam = params?.slug || params?.id;
            if (!slugParam || typeof slugParam !== 'string') return;

            const id = slugParam.split('-').pop();
            if (!id) return;

            setSongId(id);

            // 1. Fetch song details
            const song = await fetchSongById(id);
            if (song) {
                setTitle(song.title || '');
                setArtist(song.artist || '');

                const { data: linkedAlbums, error } = await supabase
                    .from('album_song')
                    .select('albumid')
                    .eq('songid', id);

                if (error) {
                    console.error('Error fetching linked albums:', error);
                    // handle error or set empty list
                    setSelectedAlbumIds([]);
                } else {
                    // Map album IDs (convert to string if needed)
                    const albumIds = linkedAlbums?.map(rel => rel.albumid.toString()) || [];

                    console.log('Linked album IDs:', albumIds);
                    setSelectedAlbumIds(albumIds);
                }
            }

            // 2. Fetch all albums
            const { data, error } = await supabase
                .from('albums')
                .select('id, name');

            if (!error) {
                setAlbums(data || []);
            }

            setLoading(false);
        };

        loadSong();
    }, [params]);

    const toggleAlbum = (id: string) => {
        setSelectedAlbumIds((prev) =>
            prev.includes(id)
                ? prev.filter((albumId) => albumId !== id)
                : [...prev.filter((id, i, a) => a.indexOf(id) === i), id] // de-duplicate
        );
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!songId) return;

        const res = await updateSong({
            id: songId,
            title,
            artist,
            albums: selectedAlbumIds,
        });

        if (res.success) {
            alert('✅ Song updated!');
            router.back();
        } else {
            alert('❌ Error updating song.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
                Loading song...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 py-10 px-4">
            <form
                onSubmit={handleUpdate}
                className="max-w-xl mx-auto bg-white p-8 rounded-md shadow space-y-6"
            >
                <h2 className="text-2xl font-bold text-gray-800">Edit Song</h2>

                {/* Title */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Title</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Artist */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Artist</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        required
                    />
                </div>

                {/* Albums */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Albums</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {albums.map((album) => {
                            const albumId = normalizeId(album.id);
                            return (
                                <label
                                    key={albumId}
                                    className="flex items-center gap-2 text-sm text-gray-800"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedAlbumIds.includes(albumId)}
                                        onChange={() => toggleAlbum(albumId)}
                                    />
                                    {album.name}
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/songs')}
                        className="text-gray-600 hover:underline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </main>
    );
}
