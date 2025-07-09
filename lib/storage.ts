import { supabase } from './supabase';

export const getPublicUrl = (bucket: string, path: string): string | null => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  if (!data?.publicUrl) {
    console.error('Error fetching public URL');
    return null;
  }

  return data.publicUrl;
};
