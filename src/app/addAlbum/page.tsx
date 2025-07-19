"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddAlbum() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !coverFile) {
            setMessage("Please fill name and choose a cover image.");
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const fileName = `${Date.now()}_${coverFile.name}`;

            // Upload cover image
            const { error: uploadError } = await supabase.storage
                .from("music-images")
                .upload(`covers/album_covers/${fileName}`, coverFile, {
                    upsert: true,
                });

            if (uploadError) {
                console.error(uploadError);
                setMessage(`Error uploading cover: ${uploadError.message}`);
                return;
            }

            // Insert album record
            const { error: dbError } = await supabase
                .from("albums")
                .insert({
                    name,
                    description,
                    "cover-image": `covers/album_covers/${fileName}`,
                    // created_at will be set automatically by default
                });

            if (dbError) {
                console.error(dbError);
                setMessage(`Error saving album: ${dbError.message}`);
                return;
            }

            setMessage("✅ Album created successfully!");
            setName("");
            setDescription("");
            setCoverFile(null);
        } catch (error) {
            console.error(error);
            setMessage("Unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleUpload}
            className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow space-y-6"
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Create New Album
            </h2>

            <div>
                <label className="block text-gray-700 font-semibold mb-1">
                    Album Name
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="My Album"
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 font-semibold mb-1">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Album description..."
                    rows={3}
                />
            </div>

            <div>
                <label className="block text-gray-700 font-semibold mb-2">
                    Upload Album Cover
                </label>
                <div className="relative flex items-center border border-gray-300 rounded-md px-4 py-3 bg-gray-50 hover:border-green-500">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                        className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700"
                        required
                    />
                </div>
                {coverFile && (
                    <p className="mt-2 text-sm text-gray-600">
                        Selected: {coverFile.name}
                    </p>
                )}
            </div>

            {message && (
                <div
                    className={`text-sm font-medium mt-4 ${message.startsWith("✅") ? "text-green-600" : "text-red-600"
                        }`}
                >
                    {message}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-md font-semibold text-white ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
            >
                {loading ? "Creating..." : "Create Album"}
            </button>
        </form>
    );
}
