'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAllUsers, deleteUserById } from '@/utils/user';
import { FaTrash, FaPen } from 'react-icons/fa';

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

    // Function to handle user deletion
    const handleDeleteUser = async (userId: string) => {
        const confirmed = confirm('Are you sure you want to delete this user?');
        if (!confirmed) return;

        try {
            const result = await deleteUserById(userId);
            if (result.success) {
                alert('User deleted successfully!');
                // Refresh your user list here
            } else {
                alert('Failed to delete user: ' + result.message);
            }
        } catch (error: any) {
            alert('Error deleting user: ' + error.message);
        }
    };

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
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-gray-50">
                            {users.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-4 text-center text-gray-400 italic bg-white"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}

                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="bg-white hover:bg-gray-100 transition duration-200"
                                >
                                    <td
                                        className="px-6 py-4 font-mono text-sm text-gray-900 max-w-[200px] overflow-hidden truncate cursor-pointer"
                                        onClick={() => router.push(`/users/${user.id}`)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                router.push(`/users/${user.id}`);
                                            }
                                        }}
                                    >
                                        {user.id}
                                    </td>
                                    <td
                                        className="px-6 py-4 text-sm text-gray-900 font-medium truncate cursor-pointer"
                                        onClick={() => router.push(`/users/${user.id}`)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                router.push(`/users/${user.id}`);
                                            }
                                        }}
                                    >
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
                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                                        {renderMetadata(user.user_metadata)}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm space-x-16">
                                        {/* Edit Button */}
                                        <button
                                            onClick={() => router.push(`/users/${user.id}/edit`)}
                                            className="text-gray-500 hover:text-blue-800"
                                            aria-label={`Edit user ${user.email}`}
                                            title="Edit User"
                                        >
                                            <FaPen size={16} />
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-gray-500
                                                hover:text-red-800"
                                            aria-label={`Delete user ${user.email}`}
                                            title="Delete User"
                                        >
                                            <FaTrash size={16} />
                                        </button>
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
