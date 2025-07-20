'use client';

import { useState } from 'react';
import { createAlbum } from '@/utils/album';

export default function AddAlbum() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !coverFile) {
            setMessage('Please provide an album name and a cover image.');
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const result = await createAlbum({ name, description, coverFile });

            if (result.success) {
                setMessage('✅ Album created successfully!');
                setName('');
                setDescription('');
                setCoverFile(null);
            } else {
                setMessage(`❌ ${result.message}`);
            }
        } catch (err) {
            console.error(err);
            setMessage('Unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <form
                onSubmit={handleUpload}
                className="w-full max-w-lg bg-white p-8 rounded-lg shadow space-y-6"
            >
                <h2 className="text-2xl font-bold text-gray-800">Create New Album</h2>

                {/* Name */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Album Name</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Chill Vibes"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Description</label>
                    <textarea
                        className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Add a short description (optional)"
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Album Cover</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                        className="block w-full border border-gray-300 px-3 py-2 rounded text-black bg-gray-50"
                        required
                    />
                    {coverFile && (
                        <p className="mt-1 text-sm text-gray-500">Selected: {coverFile.name}</p>
                    )}
                </div>

                {/* Message */}
                {message && (
                    <div className={`text-sm font-semibold mt-2 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </div>
                )}

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded text-white font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Creating...' : 'Create Album'}
                </button>
            </form>
        </main>
    );
}
