import { supabase as supabaseAdmin } from './../lib/supabase';

/**
 * Fetch all users (paginated, or all if small)
 */
export async function fetchAllUsers() {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers(); // List all users

    if (error) {
        console.error('fetchAllUsers error:', error);
        throw error;
    }

    return data.users; // array of users
}

/**
 * Fetch user by id
 */
export async function fetchUserById(id: string) {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);
    if (error) {
        console.error('fetchUserById error:', error);
        throw error;
    }
    return data.user;
}

/**
 * Create a new user with email and random temp password (secure)
 * You can send password reset link for password setup later
 */
export async function createUserWithEmail(
    email: string,
    metadata: Record<string, any> = {}
) {
    // Generate a random temporary password if you want (can also leave blank => user uses magic link)
    const tempPassword = crypto.randomUUID().replace(/-/g, '').slice(0, 16);

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true, // email confirmed, or false if you want user to confirm email
        user_metadata: metadata,
    });

    if (error) {
        console.error('createUserWithEmail error:', error);
        throw error;
    }

    return { user: data.user, tempPassword };
}

/**
 * Update a user's profile info and/or email
 * metadata is an object of changes, e.g. { first_name: 'John' }
 */
export async function updateUserById(
    id: string,
    {
        email,
        user_metadata,
    }: { email?: string; user_metadata?: Record<string, any> }
) {
    const updates: Record<string, any> = {};
    if (email) updates.email = email;
    if (user_metadata) updates.user_metadata = user_metadata;

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        id,
        updates
    );

    if (error) {
        console.error('updateUserById error:', error);
        throw error;
    }

    return data.user;
}

/**
 * Delete user by ID
 */
export async function deleteUserById(id: string) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
        console.error('deleteUserById error:', error);
        throw error;
    }

    return true;
}

/**
 * Send password reset email to a given email address
 */
export async function sendPasswordResetEmail(email: string) {
    const { data, error } = await supabaseAdmin.auth.admin.resetPasswordForEmail(
        email
    );
    if (error) {
        console.error('sendPasswordResetEmail error:', error);
        throw error;
    }
    return data;
}
