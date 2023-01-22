import { MusicBrainzApi } from 'musicbrainz-api';

const mbApi = new MusicBrainzApi({
    appName: process.env.MB_APP_NAME,
    appVersion: process.env.MB_APP_VERSION,
    appContactInfo: process.env.MB_APP_CONTACT_INFO,
});

export async function getRecordingByIsrc(isrc: string): Promise<unknown> {
    try {
        const data = await fetch(`https://musicbrainz.org/ws/2/isrc/${isrc}?inc=artists&fmt=json`, {
            method: 'GET',
            headers: {
                'User-Agent': `${process.env.MB_APP_NAME}/${process.env.MB_APP_VERSION} (${process.env.MB_APP_CONTACT_INFO})`,
            }
        });
        return data;
    } catch (error: unknown) {
        console.log(error)
        throw error;
    }
}