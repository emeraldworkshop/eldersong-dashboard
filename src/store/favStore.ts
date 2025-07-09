import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Song } from '@/types/song';

type FavStore = {
  favoriteSongIds: number[]; // Assuming song ID is bigint
  fetchFavorites: (userId: string) => Promise<void>;
  addToFavorites: (userId: string, songId: number) => Promise<void>;
  removeFromFavorites: (userId: string, songId: number) => Promise<void>;
};

export const useFavStore = create<FavStore>((set, get) => ({
  favoriteSongIds: [],

  fetchFavorites: async (userId) => {
    const { data, error } = await supabase
      .from('favorites')
      .select('song_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching favorites:', error.message);
    } else {
      const favIds = data.map((fav) => fav.song_id);

    //   console.log({ favoriteSongIds: favIds });
      set({ favoriteSongIds: favIds });
    }
  },

  addToFavorites: async (userId, songId) => {
    const { favoriteSongIds } = get();

    console.log('Adding to favorites:', { userId, songId });
    // Check if the song is already in favorites

    console.log('Current favoriteSongIds:', favoriteSongIds);


    const { error } = await supabase.from('favorites').insert({
      user_id: userId,
      song_id: songId,
    });
    if (!error) {

        console.log('Song added to favorites:', songId);
      set({ favoriteSongIds: [...favoriteSongIds, songId] });
    } else {
      console.error('Add to favorites error:', error.message);
    }
  },

  removeFromFavorites: async (userId, songId) => {
    const { favoriteSongIds } = get();

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('song_id', songId);

    if (!error) {
      set({
        favoriteSongIds: favoriteSongIds.filter((id) => id !== songId),
      });
    } else {
      console.error('Remove from favorites error:', error.message);
    }
  },
}));
