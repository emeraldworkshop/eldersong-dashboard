'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AddSong() {
    const [songFile, setSongFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [albums, setAlbums] = useState<any[]>([]);
    const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([]);

    // Fetch all albums
    useEffect(() => {
        const fetchAlbums = async () => {
            const { data, error } = await supabase
                .from('albums')
                .select('id, name');
            if (error) console.error('Error fetching albums:', error);
            else setAlbums(data || []);
        };
        fetchAlbums();
    }, []);

    const toggleAlbum = (id: string) => {
        setSelectedAlbumIds(prev =>
            prev.includes(id)
                ? prev.filter((albumId) => albumId !== id)
                : [...prev, id]
        );
    };

    const handleUpload = async (e: any) => {
        e.preventDefault();
        if (!songFile || !coverFile) {
            alert('Select files first!');
            return;
        }

        const timestamp = Date.now();
        const songFileName = `${timestamp}_${songFile.name}`;
        const coverFileName = `${timestamp}_${coverFile.name}`;

        // Upload song
        const { error: songErr } = await supabase.storage
            .from('music')
            .upload(`tracks/${songFileName}`, songFile, { upsert: true });

        if (songErr) {
            console.error(songErr);
            return;
        }

        // Upload cover
        const { error: coverErr } = await supabase.storage
            .from('music-images')
            .upload(`covers/${coverFileName}`, coverFile, { upsert: true });

        if (coverErr) {
            console.error(coverErr);
            return;
        }

        // Insert song into DB
        const { data: songData, error: dbErr } = await supabase
            .from('songs')
            .insert({
                title,
                artist,
                music_path: `tracks/${songFileName}`,
                image_path: `covers/${coverFileName}`,
            })
            .select()
            .single();

        if (dbErr || !songData) {
            console.error(dbErr);
            return;
        }

        // Link song to selected albums via album_song table
        const links = selectedAlbumIds.map((albumId) => ({
            songid: songData.id,
            albumid: albumId,
        }));

        const { error: linkError } = await supabase
            .from('album_song')
            .insert(links);

        if (linkError) {
            console.error(linkError);
            return;
        }

        alert('Song uploaded and linked to albums!');
        // Reset form
        setTitle('');
        setArtist('');
        setSongFile(null);
        setCoverFile(null);
        setSelectedAlbumIds([]);
    };

    return (
        <form
            onSubmit={handleUpload}
            className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow space-y-6"
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Song</h2>

            {/* Song Title */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1">Song Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {/* Artist */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1">Artist</label>
                <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {/* Song File */}
            <div>
                <label className="block text-gray-700 font-semibold mb-2">Upload Song</label>
                <input
                    type="file"
                    accept="audio/mpeg"
                    onChange={(e) => setSongFile(e.target.files?.[0] || null)}
                    className="w-full text-sm file:bg-blue-600 file:text-white file:rounded file:px-4 file:py-2 hover:file:bg-blue-700"
                    required
                />
                {songFile && <p className="mt-2 text-sm text-gray-600">Selected: {songFile.name}</p>}
            </div>

            {/* Cover File */}
            <div>
                <label className="block text-gray-700 font-semibold mb-2">Upload Cover</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    className="w-full text-sm file:bg-green-600 file:text-white file:rounded file:px-4 file:py-2 hover:file:bg-green-700"
                    required
                />
                {coverFile && <p className="mt-2 text-sm text-gray-600">Selected: {coverFile.name}</p>}
            </div>

            {/* Album Selector */}
            <div>
                <label className="block text-gray-700 font-semibold mb-2">Select Albums</label>
                <div className="grid gap-2">
                    {albums.map((album) => (
                        <label key={album?.id} className="flex items-center gap-2">
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

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Add Song
            </button>
        </form>
    );
}
