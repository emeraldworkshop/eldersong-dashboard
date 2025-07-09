export interface Song {
    id: number;
    title: string;
    artist: string;
    music_path: string;
    image_path: string;
    musicUrl: string;
    coverUrl: string;
  }

  export interface Album  {
    id: number;
    name: string;
    album_song: {
      songid: number;
      songs: Song;
    }[];
  };
  