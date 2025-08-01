'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { addSong } from '@/utils/song';


export default function AddSong() {
    const router = useRouter();

    const [songFile, setSongFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [albums, setAlbums] = useState([]);
    const [selectedAlbumIds, setSelectedAlbumIds] = useState([]);

    // Fetch albums
    useEffect(() => {
        const fetchAlbums = async () => {
            const { data, error } = await supabase.from('albums').select('id, name');
            if (error) console.error('Error fetching albums:', error);
            else setAlbums(data);
        };
        fetchAlbums();
    }, []);

    const toggleAlbum = (id: string) => {
        setSelectedAlbumIds((prev) =>
            prev.includes(id) ? prev.filter((albumId) => albumId !== id) : [...prev, id]
        );
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!songFile || !coverFile) {
            alert('Please select both a song and a cover file.');
            return;
        }

        const res = await addSong({
            title,
            artist,
            songFile,
            coverFile,
            albumIds: selectedAlbumIds,
        });

        if (res.success) {
            alert('✅ Song added successfully');
            // Reset form
            setTitle('');
            setArtist('');
            setSongFile(null);
            setCoverFile(null);
            setSelectedAlbumIds([]);
            router.push('/songs'); // Optional: navigate to all songs
        } else {
            alert('❌ Failed to upload song. Check console.');
            console.error(res.error);
        }
    };


    return (
        <main className="min-h-screen bg-gray-100 py-10 px-4">
            {/* Header with title and back button */}
            <div className="max-w-xl mx-auto flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">🎵 Add New Song</h2>
                <button
                    onClick={() => router.back()}
                    // OR use router.push('/songs') if using `useRouter()`
                    className="text-sm text-blue-600 hover:underline font-semibold"
                >
                    ← Back to All Songs
                </button>
            </div>

            {/* Form starts here */}
            <form
                onSubmit={handleUpload}
                className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow space-y-6"
            >

                {/* Song Title */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Song Title</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-2 focus:ring-blue-500"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Blinding Lights"
                        required
                    />
                </div>

                {/* Artist */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Artist Name</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-2 focus:ring-blue-500"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        placeholder="e.g. The Weeknd"
                        required
                    />
                </div>

                {/* Upload Song */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Upload MP3 File</label>
                    <input
                        type="file"
                        accept="audio/mpeg"
                        onChange={(e) => setSongFile(e.target.files?.[0] || null)}
                        className="w-full border border-gray-300 p-2 rounded text-black bg-white file:bg-blue-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-blue-700"
                        required
                    />
                    {songFile && (
                        <p className="mt-1 text-sm text-gray-500">Selected: {songFile.name}</p>
                    )}
                </div>

                {/* Upload Cover */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Upload Cover Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                        className="w-full border border-gray-300 p-2 rounded text-black bg-white file:bg-green-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-green-700"
                        required
                    />
                    {coverFile && (
                        <p className="mt-1 text-sm text-gray-500">Selected: {coverFile.name}</p>
                    )}
                </div>

                {/* Album Selector */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Select Albums</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {albums.map((album) => (
                            <label key={album?.id} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={selectedAlbumIds.includes(album?.id)}
                                    onChange={() => toggleAlbum(album.id)}
                                />
                                <span className="text-gray-800">{album?.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    ➕ Add Song
                </button>
            </form>
        </main>
    );
}
