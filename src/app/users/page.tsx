'use client';

import { fetchAllUsers } from '@/services/authService';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function page() {
    // This page is for displaying all users
    const router = useRouter();

    const [users, setUsers] = React.useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const res = await fetchAllUsers();
            if (!res) {
                console.error('No users found');
                return;
            }

            console.log('Fetched users:', res);
            setUsers(res.users);
        })();
    }, []);

    return (
        <main className="max-w-5xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">All Users</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Email
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Created At
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Metadata
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} onClick={() => console.log(`Navigating to user ${user.id}`)
                            } className="cursor-pointer hover:bg-gray-100">
                                <td className="px-4 py-3 text-sm text-gray-700">{user.id}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                    {user.email || '-'}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                    {user.created_at
                                        ? new Date(user.created_at).toLocaleString()
                                        : '-'}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                    <pre className="text-xs bg-gray-100 p-2 rounded">
                                        {JSON.stringify(user.user_metadata, null, 2)}
                                    </pre>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
