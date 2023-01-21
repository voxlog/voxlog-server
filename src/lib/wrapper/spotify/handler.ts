import SpotifyWebApi from "spotify-web-api-node";

const api = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function getAccessToken() {
  const data = await api.clientCredentialsGrant();
  api.setAccessToken(data.body["access_token"]);
};

export async function getTrack(trackId: string): Promise<unknown> {
  try {
    const data = await api.getTrack(trackId);
    return data.body;
  } catch (error: unknown) {
    const statusCode = (error as any).statusCode;
    if (statusCode === 401) {
      await getAccessToken();
      return getTrack(trackId);
    }
    throw error;
  }
}

export async function getAlbum(trackId: string): Promise<unknown> {
  try {
    const data = await api.getAlbum(trackId);
    return data.body;
  } catch (error: unknown) {
    const statusCode = (error as any).statusCode;
    if (statusCode === 401) {
      await getAccessToken();
      return getAlbum(trackId);
    }
    throw error;
  }
}

export async function getArtist(artistId: string): Promise<unknown> {
  try {
    const data = await api.getArtist(artistId);
    return data.body;
  } catch (error: unknown) {
    
    const statusCode = (error as any).statusCode;
    if (statusCode === 401) {
      await getAccessToken();
      return getArtist(artistId);
    }
    throw error;
  }
}
