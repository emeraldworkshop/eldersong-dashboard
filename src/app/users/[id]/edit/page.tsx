'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchUserById, updateUserById } from '@/utils/user';

type UserProfile = {
    id: string;
    email: string;
    user_metadata?: {
        first_name?: string;
        last_name?: string;
        organisation?: string;
    };
};

export default function EditUserPage() {
    const { id: userId } = useParams();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [organisation, setOrganisation] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        (async () => {
            try {
                // Fetch user data (adjust according to your fetchUserById implementation)
                const data = await fetchUserById(userId);

                if (!data) {
                    setError('User not found');
                    setLoading(false);
                    return;
                }

                // Support both cases: data.user or data itself is user
                const user = data?.user ?? data;

                setEmail(user?.email ?? '');
                setOriginalEmail(user?.email ?? '');

                setFirstName(user?.user_metadata?.fname ?? '');
                setLastName(user?.user_metadata?.lname ?? '');
                setOrganisation(user?.user_metadata?.org ?? '');
            } catch (err) {
                setError(err.message ?? 'Error fetching user data');
            } finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {

            const res = await updateUserById(userId, {
                email,
                "user_metadata": {
                    fname: firstName,
                    lname: lastName,
                    org: organisation,
                },
            });
            if (!res) {
                setError('Failed to update user');
                return;
            }

            alert(
                'User updated successfully' +
                (originalEmail !== email ? ' and password reset email sent.' : '')
            );

            router.back();
        } catch (err) {
            setError(err.message || 'Error updating user');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600">Loading user data...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-xl mx-auto bg-white shadow rounded p-6">
                <h1 className="text-black text-2xl font-semibold mb-6">Edit User</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.trim())}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* First Name */}
                    <div>
                        <label htmlFor="firstName" className="block mb-1 font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label htmlFor="lastName" className="block mb-1 font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Organisation */}
                    <div>
                        <label htmlFor="organisation" className="block mb-1 font-medium text-gray-700">
                            Organisation
                        </label>
                        <input
                            id="organisation"
                            type="text"
                            value={organisation}
                            onChange={(e) => setOrganisation(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={saving}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
