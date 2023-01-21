type SpotifyScrobble = {
    // TODO: ver se isso tá certo com o Becelli, ou se é um token
    user_id: string;
    spid_track: string;
    track_isrc: string;
};

type MusicBrainzScrobble = {
    user_id: string;
    mbid_recording: string;
    mbid_release: string;
};

type SimpleScrobble = {
    user_id: string;
    track_title: string;
    artist_name: string;
};

export type Scrobble = SpotifyScrobble | MusicBrainzScrobble | SimpleScrobble;
