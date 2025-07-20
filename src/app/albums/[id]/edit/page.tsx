'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { updateAlbum, AlbumPayload } from '@/utils/album';
import { supabase } from '@/lib/supabase';

export default function EditAlbum() {
    const router = useRouter();
    const params = useParams();
    const [albumId, setAlbumId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [currentCoverUrl, setCurrentCoverUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);

    // 1. Parse slug and fetch album
    useEffect(() => {
        const fetchAlbumBySlug = async () => {
            const slugParam = params?.id;

            if (!slugParam || typeof slugParam !== 'string') {
                console.warn('Slug not found in route.');
                setLoading(false);
                return;
            }

            const idStr = slugParam.split('-').pop();
            const id = Number(idStr);

            if (!id) {
                console.warn('Invalid album ID in slug.');
                setLoading(false);
                return;
            }

            setAlbumId(id);

            const { data, error } = await supabase
                .from('albums')
                .select('*')
                .eq('id', id)
                .single();

            if (!error && data) {
                setName(data.name);
                setDescription(data.description || '');
                setCurrentCoverUrl(data['cover-image']);
            } else {
                console.error('Error fetching album:', error);
            }

            setLoading(false);
        };

        fetchAlbumBySlug();
    }, [params]);


    // 2. Handle form submit
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !albumId) return;

        setMessage(null);
        setLoading(true);

        const result = await updateAlbum(albumId, { name, description, coverFile });

        setMessage(result.success ? '✅ Album updated!' : `❌ ${result.message}`);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-700">
                Loading album...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <form
                onSubmit={handleUpdate}
                className="w-full max-w-lg bg-white p-8 rounded-lg shadow space-y-6"
            >
                <h2 className="text-2xl font-bold text-gray-800">Edit Album</h2>

                {/* Name */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Album Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Description</label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    />
                </div>

                {/* Cover Image */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Album Cover</label>
                    {currentCoverUrl && !coverFile && (
                        <img
                            src={supabase.storage.from('music-images').getPublicUrl(currentCoverUrl).data.publicUrl}
                            alt="Current Cover"
                            className="mb-2 w-full h-40 object-cover rounded-lg"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                    />
                    {coverFile && (
                        <p className="text-sm text-gray-500 mt-1">New cover: {coverFile.name}</p>
                    )}
                </div>

                {/* Message */}
                {message && (
                    <div className={`text-sm font-semibold ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </div>
                )}

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded text-white font-semibold ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Updating...' : 'Update Album'}
                </button>
            </form>
        </main>
    );
}
