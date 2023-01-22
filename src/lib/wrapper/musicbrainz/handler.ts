import { MusicBrainzApi } from 'musicbrainz-api';
import convert from 'xml-js';

const mbApi = new MusicBrainzApi({
    appName: process.env.MB_APP_NAME,
    appVersion: process.env.MB_APP_VERSION,
    appContactInfo: process.env.MB_APP_CONTACT_INFO,
});

export async function getRecordingByIsrc(isrc: string): Promise<unknown> {
    try {
        return await fetch(`https://musicbrainz.org/ws/2/isrc/${isrc}?inc=artists`, {
            method: 'GET',
            headers: {
                'User-Agent': `${process.env.MB_APP_NAME}/${process.env.MB_APP_VERSION} (${process.env.MB_APP_CONTACT_INFO})`,
            }
        }).then(async res => {
            const text = await res.text();
            return JSON.parse(convert.xml2json(text, { compact: true, spaces: 4 }));
        });
    } catch (error: unknown) {
        console.log(error)
        throw error;
    }
}