import { create } from 'zustand';
import { Song, Album } from '@/types/song';

type MusicStore = {
  albums: Album[];
  currentAlbumId: number | null;
  currentSongIndex: number;

  setAlbums: (albums: Album[]) => void;
  setCurrentAlbum: (albumId: number) => void;
  setCurrentSongIndex: (index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  getCurrentSong: () => Song | null;
};

export const useMusicStore = create<MusicStore>((set, get) => ({
  albums: [],
  currentAlbumId: null,
  currentSongIndex: 0,

  setAlbums: (albums) => set({ albums }),

  setCurrentAlbum: (albumId) =>
    set({ currentAlbumId: albumId, currentSongIndex: 0 }),

  setCurrentSongIndex: (index) => set({ currentSongIndex: index }),

  playNext: () => {
    const { albums, currentAlbumId, currentSongIndex } = get();
    const album = albums.find((a) => a.id === currentAlbumId);
    if (!album) return;
  
    const nextIndex = currentSongIndex + 1;
    set({ currentSongIndex: nextIndex % album.album_song.length }); // loops to 0
  },

  playPrevious: () => {
    const { currentSongIndex } = get();
    if (currentSongIndex > 0) {
      set({ currentSongIndex: currentSongIndex - 1 });
    }
  },

  getCurrentSong: () => {
    const { albums, currentAlbumId, currentSongIndex } = get();
    const album = albums.find((a) => a.id === currentAlbumId);
    if (!album) return null;
    return album.album_song[currentSongIndex]?.songs ?? null;
  },
}));
