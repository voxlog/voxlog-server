export type TrackOut = {
  trackId: string;
  title: string;
  duration: number;

  fromAlbum: {
    albumId: string;
    title: string;
    coverArtUrl: string | null;
  };
  fromArtist: {
    artistId: string;
    name: string;
    artUrl: string | null;
  };
};
