'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchUserById } from '@/utils/user';

export default function UserDetailPage() {
    const params = useParams();
    const [user, setUser] = useState<any>(null);

    const userId = params?.id as string;

    useEffect(() => {
        (async () => {
            if (!userId) return;

            const res = await fetchUserById(userId);
            if (!res) {
                console.error('No user found');
                return;
            }
            setUser(res.user);
        })();
    }, [userId]);

    console.log('User details:', user);


    return (
        <main className=" mx-auto p-8 min-h-screen bg-white">

            <section className='max-w-3xl mx-auto'>

                <h1 className="text-3xl font-bold mb-6 text-gray-900">User Details</h1>

                <div className="grid grid-cols-1 gap-6">
                    <Section title="Basic Info">
                        <Detail label="ID" value={user?.id} />
                        <Detail label="Email" value={user?.email || '-'} />
                        <Detail
                            label="Created At"
                            value={
                                user?.created_at
                                    ? new Date(user.created_at).toLocaleString()
                                    : '-'
                            }
                        />
                        <Detail
                            label="Last Sign In"
                            value={
                                user?.last_sign_in_at
                                    ? new Date(user.last_sign_in_at).toLocaleString()
                                    : '-'
                            }
                        />
                    </Section>

                    <Section title="App Metadata">
                        <pre className="bg-gray-50 text-sm p-3 rounded overflow-auto text-gray-700">
                            {JSON.stringify(user?.app_metadata, null, 2)}
                        </pre>
                    </Section>

                    <Section title="User Metadata">
                        <pre className="bg-gray-50 text-sm p-3 rounded overflow-auto text-gray-700">
                            {JSON.stringify(user?.user_metadata, null, 2)}
                        </pre>
                    </Section>

                    <Section title="Identities">
                        <pre className="bg-gray-50 text-sm p-3 rounded overflow-auto text-gray-700">
                            {JSON.stringify(user?.identities, null, 2)}
                        </pre>
                    </Section>
                </div>

                <div className="mt-8">
                    <Link
                        href="/users"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        ← Back to Users List
                    </Link>
                </div>

            </section>


        </main>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="border border-gray-200 rounded p-4 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
            {children}
        </div>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="py-2 grid grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="text-sm text-gray-800 col-span-2 break-all">{value}</dd>
        </div>
    );
}
