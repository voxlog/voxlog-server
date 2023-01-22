import { MusicBrainzApi } from 'musicbrainz-api';

const mbApi = new MusicBrainzApi({
    appName: process.env.MB_APP_NAME,
    appVersion: process.env.MB_APP_VERSION,
    appContactInfo: process.env.MB_APP_CONTACT_INFO,
});