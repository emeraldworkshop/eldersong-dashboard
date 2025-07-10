'use client';

import { fetchUserById } from '@/services/authService';
import { log } from 'console';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

export default function page() {
    // This page is for displaying a specific user by ID
    const [user, setUser] = React.useState<any>([]);

    const params = useParams();
    const userId = Array.isArray(params) ? params[0] : params;

    useEffect(() => {
        (async () => {
            // Here you would typically fetch the user data by ID

            console.log('Fetching user by ID:', userId);
            
            const res = await fetchUserById(userId);
            if (!res) {
                console.error('No user found with the given ID');
                return;
            }
            setUser(res);
            console.log('Fetched user by ID:', userId);
        })();
    }, []);


    return (
        <main className="max-w-3xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">User Details</h1>

            <div className="grid grid-cols-1 gap-4">
                <div className="border border-gray-200 rounded p-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        Basic Info
                    </h2>
                    <dl className="divide-y divide-gray-100">
                        <Detail label="ID" value={user?.id} />
                        <Detail label="Email" value={user?.email || '-'} />
                        <Detail
                            label="Created At"
                            value={
                                user.created_at
                                    ? new Date(user.created_at).toLocaleString()
                                    : '-'
                            }
                        />
                        <Detail
                            label="Last Sign In"
                            value={
                                user.last_sign_in_at
                                    ? new Date(user.last_sign_in_at).toLocaleString()
                                    : '-'
                            }
                        />
                    </dl>
                </div>

                <div className="border border-gray-200 rounded p-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        App Metadata
                    </h2>
                    <pre className="bg-gray-50 text-sm p-3 rounded overflow-auto">
                        {JSON.stringify(user.app_metadata, null, 2)}
                    </pre>
                </div>

                <div className="border border-gray-200 rounded p-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        User Metadata
                    </h2>
                    <pre className="bg-gray-50 text-sm p-3 rounded overflow-auto">
                        {JSON.stringify(user.user_metadata, null, 2)}
                    </pre>
                </div>

                <div className="border border-gray-200 rounded p-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        Identities
                    </h2>
                    <pre className="bg-gray-50 text-sm p-3 rounded overflow-auto">
                        {JSON.stringify(user.identities, null, 2)}
                    </pre>
                </div>
            </div>

            <div className="mt-6">
                <a
                    href="/users"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Back to Users List
                </a>
            </div>
        </main>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="py-2 grid grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="text-sm text-gray-700 col-span-2 break-all">{value}</dd>
        </div>
    );
}
