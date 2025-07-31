'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addNewUser } from '@/utils/user';

export default function AddNewUserPage() {
    const router = useRouter();

    // Form state
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [organisation, setOrganisation] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);

    // UI state
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            const newUser = await addNewUser({
                email: email,
                fname: firstName,
                lname: lastName,
                org: organisation,
                email_confirm: emailVerified, // or false if unverified
            });
            alert('User added with ID: ' + newUser.id);
            router.back();
        } catch (error) {
            alert('Add user failed: ' + error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-xl mx-auto bg-white shadow rounded p-6">
                <h1 className="text-black text-2xl font-semibold mb-6">Add New User</h1>

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
                            onChange={(e) => setEmail(e.target.value)}
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

                    {/* Email Verified Checkbox */}
                    <div className="flex items-center space-x-2">
                        <input
                            id="emailVerified"
                            type="checkbox"
                            checked={emailVerified}
                            onChange={() => setEmailVerified(!emailVerified)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="emailVerified" className="text-gray-700 select-none">
                            Mark email as verified
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => router.push('/users')}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {saving ? 'Adding...' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
