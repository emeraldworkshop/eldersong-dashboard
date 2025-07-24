'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAllUsers } from '@/utils/user';

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = React.useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const res = await fetchAllUsers();
            if (!res) {
                console.error('No users found');
                return;
            }
            setUsers(res.users);
        })();
    }, []);

    const renderMetadata = (metadata: any) => {
        if (!metadata || Object.keys(metadata).length === 0) return '-';
        const jsonStr = JSON.stringify(metadata, null, 2);
        const truncated = jsonStr.length > 80 ? jsonStr.substring(0, 80) + '...' : jsonStr;
        return (
            <pre
                className="text-xs bg-gray-200 p-2 rounded max-w-xs whitespace-pre-wrap overflow-hidden text-ellipsis break-words cursor-help"
                title={jsonStr}
            >
                {truncated}
            </pre>
        );
    };

    return (
        <main className="min-h-screen bg-white p-8">
            <section className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-8 text-gray-900">All Users</h1>

                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 bg-gray-50">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Metadata
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-gray-50">
                            {users.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-4 text-center text-gray-400 italic bg-white"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}

                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    onClick={() => router.push(`/users/${user.id}`)}
                                    className="cursor-pointer bg-white hover:bg-gray-100 transition duration-200"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            router.push(`/users/${user.id}`);
                                        }
                                    }}
                                >
                                    <td className="px-6 py-4 font-mono text-sm text-gray-900 max-w-[200px] overflow-hidden truncate">
                                        {user.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium truncate">
                                        {user.email || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 truncate">
                                        {user.created_at
                                            ? new Date(user.created_at).toLocaleString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })
                                            : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {renderMetadata(user.user_metadata)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}
