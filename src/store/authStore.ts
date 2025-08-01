// stores/authStore.ts
import { create } from 'zustand';
import { supabase } from '../src/lib/supabase'; // adjust import path if needed

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAlertStore } from './alertStore';
import { router } from 'expo-router';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useFavStore } from './favStore';

const { setLoading, showAlert } = useAlertStore.getState();
const { fetchFavorites } = useFavStore.getState();

type AuthStore = {
  user;

  signUp: (
    email: string,
    password: string,
    fname: string,
    lname: string,
    org: string
  ) => Promise<void>;
  signIn: (
    email: string,
    password: string,
    fromVerifyScreen?: boolean
  ) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  updateProfile: (updates: { name?: string; organization?: string }) => Promise<void>;
};

// THIS IS A FUCNTION TO CHECK ON SIGN UP IS A USER IS ALREADY A CUSTOMER
export const checkIfUserExists = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  console.log(data, 'data');
  console.log(error, error);

  return !!data; // true = user exists
};

//THIS IS A FUCNTION TO CHECK IF USER HASVERIFIED THEIR EMAIL
export const checkIfEmailIsVerified = async (data) => {
  console.log('data>> checing email verification', data);
  return data?.user?.user_metadata?.email_verified;
};

//THIS FUCNTION IS TO ADD USER TO THE USERS TABEL AFTER THEY VERIFY THEIR EMAIL
const addUserToTableIfNeeded = async (user) => {
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', user.email)
    .maybeSingle();

  if (!existing) {
    await supabase.from('users').insert([
      {
        id: user.id,
        email: user.email,
      },
    ]);
  }
};

//THIS FUCNTION IS USED TO RESEND THE VEIRIFCATION CODE

export const resendVerificationLink = async (email: string) => {
  const {} = await supabase.auth.signInWithOtp({ email });
  return true;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,

  signUp: async (email, password, fname, lname, org) => {
    setLoading(true);

    const isALreadyUser = await checkIfUserExists(email);

    if (isALreadyUser) {
      showAlert(
        'error',
        'Looks like you already have an account. Log in instead.'
      );
      setLoading(false);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fname,
            lname,
            org,
          },
          emailRedirectTo: 'https://eldersongplus-com--2d9apn4ctm.expo.app/confirm-signup', // Change to your app's verification URL
        },
      });
      if (error) {
        showAlert('error', error.message);
      } else {
        router.push({
          pathname: '/(auth)/verify-email',
          params: {
            email,
            password,
            fname,
            lname,
            org,
          },
        });

        return data;
      }
      setLoading(false);
    }
  },

  signIn: async (email, password, fromVerifyScreen = false) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.message.toLowerCase() == 'email not confirmed') {
        await resendVerificationLink(email);
        if (!fromVerifyScreen) {
          showAlert(
            'info',
            'Email not confirmed. A verification link has been sent to your email. Please check your inbox.'
          );

          router.push({
            pathname: '/(auth)/verify-email',
            params: {
              email,
              password,
            },
          });
        }
      } else {
        showAlert('error', error.message);
      }

      console.log(error);
    } else {
      await AsyncStorage.setItem('session', JSON.stringify(data.session));
      await addUserToTableIfNeeded(data.user);
      set({ user: data.user });
      await fetchFavorites(data.user.id);
    }
    setLoading(false);
  },

  signOut: async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem('session');
    set({ user: null });
  },

  restoreSession: async () => {
    setLoading(true);
    try {
      const sessionStr = await AsyncStorage.getItem('session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        // console.log('There is session', session);
        const { data } = await supabase.auth.setSession(session);

        if (data?.user) {
          // console.log('usser', data.user);
          set({ user: data.user });
          await fetchFavorites(data.user.id);
        }
        setLoading(false);
      }
    } catch (err) {
      console.error({ err });
    } finally {
      setLoading(false);
    }
  },

  signInWithGoogle: async () => {
    setLoading(true);
    try {
      // 1. Define the redirect URI for your Expo app
      // This MUST match the 'scheme' in your app.json (e.g., "eldersong.com")
      // And ALSO be configured in your Google Cloud Console (Authorized Redirect URIs for Web)
      // and Supabase (Callback URL for Google provider).
      const redirectUri = makeRedirectUri({
        scheme: 'eldersong.com', // Use the scheme from your app.json
        // path: 'auth/callback', // Optional: You can specify a path if you have a specific route for callbacks
      });

      console.log('Redirect URI for Google:', redirectUri);

      // 2. Initiate the OAuth flow with Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: false, // Essential for Expo native apps
          scopes: 'email profile', // Request email and profile data
        },
      });

      if (error) {
        console.error('Supabase signInWithOAuth error:', error);
        showAlert('error', error.message || 'Google sign-in failed.');
        return;
      }

      if (data?.url) {
        // 3. Open the authentication URL in a web browser
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUri
        );

        // This block handles the result after the browser session closes
        if (result.type === 'success') {
          // Supabase's auth listener will automatically pick up the session from the redirect.
          // You don't usually need to manually get the session immediately here,
          // as the onAuthStateChange listener (if you have one elsewhere, which is recommended)
          // will fire and update your user state.
          // However, for immediate feedback or if not relying solely on a listener,
          // you can attempt to get the session.
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession();

          if (sessionError) {
            console.error(
              'Error getting session after Google sign-in:',
              sessionError
            );
            showAlert(
              'error',
              sessionError.message || 'Failed to retrieve session.'
            );
          } else if (session) {
            // Add user to your 'users' table if they don't exist
            await addUserToTableIfNeeded(session.user);
            set({ user: session.user }); // Update Zustand store with the new user
            showAlert('success', 'Logged in with Google!');
            router.replace('/'); // Redirect to your main app screen (e.g., home)
          } else {
            // This case might occur if the session hasn't fully propagated yet.
            // Relying on onAuthStateChange elsewhere in your app is robust.
            showAlert('info', 'Google login completed, checking session...');
          }
        } else if (result.type === 'cancel') {
          showAlert('info', 'Google sign-in was canceled.');
        } else {
          // 'dismiss' or other unexpected types
          showAlert(
            'error',
            'Google sign-in process dismissed or failed unexpectedly.'
          );
          console.error('WebBrowser result type:', result.type, result);
        }
      }
    } catch (e) {
      console.error('Caught error during Google sign-in:', e);
      showAlert(
        'error',
        e.message || 'An unexpected error occurred during Google sign-in.'
      );
    } finally {
      setLoading(false);
    }
  },

  signInWithApple: async () => {
    setLoading(true);
    // TODO: Implement Apple Sign-In if needed
    showAlert('info', 'Apple Sign-In is not yet implemented.');
    setLoading(false);
  },

  updateProfile: async (updates: { name?: string; organization?: string }) => {
    const { user } = get();
    if (!user) return;

    const [fname, lname = ''] = (updates.name || '').split(' ');

    const {  error } = await supabase.auth.updateUser({
      data: {
        fname,
        lname,
        org: updates.organization,
      },
    });

    if (error) {
      console.error('Update profile error:', error.message);
      return;
    }

    // Refresh user state from Supabase
    const refreshedUser = await supabase.auth.getUser();
    if (refreshedUser.data?.user) {
      set({ user: refreshedUser.data.user });
    }
  },
}));
