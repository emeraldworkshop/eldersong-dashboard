import { supabase } from '@/lib/supabase';

export async function deleteSong(songId: string, coverPath?: string, audioPath?: string) {
  try {
    // 1. Delete from favorites
    const { error: favError } = await supabase
      .from('favorites')
      .delete()
      .eq('song_id', songId);

    if (favError) throw favError;

    // 2. Delete from album_songs (pivot table)
    const { error: albumError } = await supabase
      .from('album_song')
      .delete()
      .eq('songid', songId);

    if (albumError) throw albumError;

    // 3. Delete from songs table
    const { error: songError } = await supabase
      .from('songs')
      .delete()
      .eq('id', songId);

    if (songError) throw songError;

    // 4. Delete from Supabase Storage
    const errors = [];

    if (coverPath) {
      const { error: coverDelError } = await supabase.storage
        .from('music-images')
        .remove([coverPath]);
      if (coverDelError) errors.push(coverDelError.message);
    }

    if (audioPath) {
      const { error: audioDelError } = await supabase.storage
        .from('music')
        .remove([audioPath]);
      if (audioDelError) errors.push(audioDelError.message);
    }

    return {
      success: true,
      warnings: errors.length > 0 ? errors : null,
    };
  } catch (error) {
    console.error('Delete song error:', error);
    return {
      success: false,
      error,
    };
  }
}
