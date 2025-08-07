import { supabase } from '../lib/supabase';
import { getPublicUrl } from '../lib/storage';
import { Album, Song } from '@/types/song';

export const fetchAllSongs = async () => {
  const { data, error } = await supabase.from('songs').select('*');
  if (error) throw error;

  // Add public URLs
  const songsWithUrls = data.map((song) => ({
    ...song,
    musicUrl: getPublicUrl('music', song.music_path),
    coverUrl: getPublicUrl('music-images', song.image_path),
  }));

  return songsWithUrls;
};

export const fetchAllAlbums = async (): Promise<Album[]> => {
  try {
    const { data, error } = await supabase.from('albums').select(`
      id,
      name,
      description,
      cover-image,
      album_song (
        songid,
        songs (
          id,
          title,
          artist,
          music_path,
          image_path
        )
      )
    `);

    if (error) throw error;

    const albumsWithUrls: Album[] = data.map((album) => ({
      id: album.id,
      name: album.name,
      description: album.description,
      'cover-image': album['cover-image'],
      cover_url: getPublicUrl('music-images', album['cover-image']),
      album_song: album.album_song.map((songEntry) => {
        const baseSong = Array.isArray(songEntry.songs)
          ? songEntry.songs[0]
          : songEntry.songs;

        const songWithUrls: Song = {
          ...baseSong,
          musicUrl: getPublicUrl('music', baseSong.music_path),
          coverUrl: getPublicUrl('music-images', baseSong.image_path),
        };

        return {
          songid: songEntry.songid,
          songs: songWithUrls,
        };
      }),
    }));

    return albumsWithUrls;
  } catch (error) {
    console.error('Error fetching albums:', error);
    return [];
  }
};

export const getFavoriteSongs = async (
  favoriteSongIds: number[]
): Promise<{ songid: string; songs: Song }[]> => {
  if (!favoriteSongIds.length) return [];

  const { data, error } = await supabase
    .from('songs')
    .select('id, title, artist, music_path, image_path')
    .in('id', favoriteSongIds);

  if (error) {
    console.error('Error fetching favorite songs:', error.message);
    return [];
  }

  const formattedSongs = data.map((song) => ({
    songid: song.id,
    songs: {
      ...song,
      musicUrl: getPublicUrl('music', song.music_path),
      coverUrl: getPublicUrl('music-images', song.image_path),
    },
  }));

  return {
    id: 'favorites',
    name: 'Favorite Songs',
    description: 'All your favorite songs in one place',
    album_song: formattedSongs,
  };
};

export const fetchAlbumById = async (albumId): Promise<Album | null> => {
  try {
    const { data, error } = await supabase
      .from('albums')
      .select(
        `
        id,
        name,
        description,
        cover-image,
        album_song (
          songid,
          order_index,
          songs (
            id,
            title,
            artist,
            music_path,
            image_path
          )
        )
      `
      )
      .eq('id', albumId)
      .single(); // fetch a single album

    if (error) throw error;

    const albumWithUrls: Album = {
      id: data.id,
      name: data.name,
      description: data.description,
      'cover-image': data['cover-image'],
      cover_url: getPublicUrl('music-images', data['cover-image']),
      album_song: data.album_song.map((songEntry) => {
        const baseSong = Array.isArray(songEntry.songs)
          ? songEntry.songs[0]
          : songEntry.songs;

        const songWithUrls: Song = {
          ...baseSong,
          musicUrl: getPublicUrl('music', baseSong.music_path),
          coverUrl: getPublicUrl('music-images', baseSong.image_path),
        };

        return {
          songid: songEntry.songid,
          order_index: songEntry.order_index,
          songs: songWithUrls,
        };
      }),
    };

    albumWithUrls.album_song.sort((a, b) => a.order_index - b.order_index);

    return albumWithUrls;
    
  } catch (error) {
    console.error('Error fetching album by ID:', error);
    return null;
  }
};

export const fetchSongById = async (songId): Promise<Song | null> => {
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('id', songId)
      .single();

    if (error) throw error;

    const songWithUrls: Song = {
      ...data,
      musicUrl: getPublicUrl('music', data.music_path),
      coverUrl: getPublicUrl('music-images', data.image_path),
    };

    return songWithUrls;
  } catch (error) {
    console.error('Error fetching song by ID:', error);
    return null;
  }
};
