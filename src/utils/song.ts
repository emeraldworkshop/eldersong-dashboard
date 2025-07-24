// src/utils/deleteSong.ts
import { supabase } from '@/lib/supabase';

interface AddSongOptions {
  title: string;
  artist: string;
  songFile: File;
  coverFile: File;
  albumIds?: string[];
}

interface UpdateSongOptions {
  id: string;
  title?: string;
  artist?: string;
  albums?: string[];
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^\w.\-]/gi, '_');
}

export async function deleteSong(
  songId: string,
  coverPath?: string,
  audioPath?: string
) {
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

export async function addSong({
  title,
  artist,
  songFile,
  coverFile,
  albumIds = [],
}: AddSongOptions) {
  try {
    const timestamp = Date.now();
    const songFilename = `${timestamp}_${sanitizeFilename(songFile.name)}`;
    const coverFilename = `${timestamp}_${sanitizeFilename(coverFile.name)}`;

    // Upload audio file
    const { error: songUploadErr } = await supabase.storage
      .from('music')
      .upload(`tracks/${songFilename}`, songFile, { upsert: true });

    if (songUploadErr) throw songUploadErr;

    // Upload cover image
    const { error: coverUploadErr } = await supabase.storage
      .from('music-images')
      .upload(`covers/${coverFilename}`, coverFile, { upsert: true });

    if (coverUploadErr) throw coverUploadErr;

    // Insert into 'songs'
    const { data: songData, error: insertErr } = await supabase
      .from('songs')
      .insert({
        title,
        artist,
        music_path: `tracks/${songFilename}`,
        image_path: `covers/${coverFilename}`,
      })
      .select()
      .single();

    if (insertErr || !songData) throw insertErr;

    // Link to albums
    if (albumIds.length > 0) {
      const links = albumIds.map((albumId) => ({
        songid: songData.id,
        albumid: albumId,
      }));

      const { error: linkErr } = await supabase
        .from('album_song')
        .insert(links);
      if (linkErr) throw linkErr;
    }

    return {
      success: true,
      song: songData,
    };
  } catch (error) {
    console.error('❌ Add song error:', error);
    return { success: false, error };
  }
}

export async function updateSong({
  id,
  title,
  artist,
  albums = [], // albums selected in UI, e.g., ['2', '3']
}: UpdateSongOptions) {
  try {
    // 1. Update title and artist if provided
    const updates: Record<string, any> = {};
    if (title) updates.title = title;
    if (artist) updates.artist = artist;

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('songs')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;
    }

    // 2. Fetch current linked album IDs from album_song
    const { data: existingLinks, error: fetchError } = await supabase
      .from('album_song')
      .select('albumid')
      .eq('songid', id);

    if (fetchError) throw fetchError;

    const existingAlbumIds = existingLinks?.map(link => link.albumid.toString()) || [];

    // Normalize all IDs to strings for comparison
    const selectedAlbumIds = albums.map(a => a.toString());

    // 3. Determine albums to delete (linked but not selected)
    const albumsToDelete = existingAlbumIds.filter(albumId => !selectedAlbumIds.includes(albumId));

    // 4. Determine albums to insert (selected but not linked)
    const albumsToInsert = selectedAlbumIds.filter(albumId => !existingAlbumIds.includes(albumId));

    // 5. Delete unselected album links
    if (albumsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('album_song')
        .delete()
        .eq('songid', id)
        .in('albumid', albumsToDelete);

      if (deleteError) throw deleteError;
    }

    // 6. Insert newly selected album links
    if (albumsToInsert.length > 0) {
      const newLinks = albumsToInsert.map(albumId => ({
        songid: id,
        albumid: Number(albumId), // convert back to number if needed
      }));

      const { error: insertError } = await supabase.from('album_song').insert(newLinks);
      if (insertError) throw insertError;
    }

    return { success: true };
  } catch (error) {
    console.error('❌ Update song error:', error);
    return { success: false, error };
  }
}
