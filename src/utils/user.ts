import { supabase as supabaseAdmin } from './../lib/supabase';

export const fetchAllUsers = async () => {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) throw error;

  return data;
};

export const fetchUserById = async (id: any) => {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);
  if (error) throw error;
  return data;
};

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
  id: any,
  {
    email,
    user_metadata,
  }: { email?: string; user_metadata?: Record<string, any> }
) {
  const updates: Record<string, any> = {};
  if (email) updates.email = email;
  if (user_metadata) updates.user_metadata = user_metadata;

  console.log('updateUserById updates:', updates);
  console.log('This fucntion is called with id:', id);
  

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

export async function deleteUserById(userId: string) {
  try {
    // Delete from favourites table
    let { error: favError } = await supabaseAdmin
      .from('favorites')
      .delete()
      .eq('user_id', userId);

    if (favError) throw favError;

    // Delete from users table (your app users table)
    let { error: usersError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);

    if (usersError) throw usersError;

    // Delete user from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    return { success: true };
  } catch (error: any) {
    console.error('Delete user error:', error);
    return { success: false, message: error.message };
  }
}


export async function sendPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
    });

    console.log('sendPasswordReset data:', data);

    if (error) {
      return { success: false, message: error.message };
    }

    // You may need to send the recovery link manually if Supabase does not send it automatically
    // For most setups, Supabase will send the email if SMTP is configured

    return { success: true, message: 'Password reset email sent' };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

