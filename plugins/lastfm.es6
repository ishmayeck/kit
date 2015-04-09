import request from 'request';
import _ from 'lodash';

Promise.promisifyAll(request);

function getNowPlaying (ENDPOINT, API_KEY, user) {
    return request.getAsync({
            uri: ENDPOINT,
            qs: {
                method: 'user.getrecenttracks',
                user: encodeURIComponent(user),
                api_key: API_KEY,
                format: 'json'
            },
            json: true
        })
        .catch((err) => { throw new Error('Unspecified error'); })
        .spread((res, data) => {
            const recentTracks = data.recenttracks;

            if (!recentTracks || !recentTracks.track || !recentTracks.track.length) {
                throw new Error(`${user} doesn't appear to have played anything`);
            }
            
            const track = recentTracks.track[0];
            const np = track['@attr'] && track['@attr'].nowplaying ? 'now playing' : 'last played';
            const artist = track.artist['#text'];
            const username = recentTracks['@attr'].user;

            return request.getAsync({
                    uri: ENDPOINT,
                    qs: {
                        method: 'track.getTopTags',
                        artist: artist,
                        track: track.name,
                        api_key: API_KEY,
                        format: 'json'
                    },
                    json: true
                })
                .catch((err) => { throw new Error('Unspecified error'); })
                .spread((res, data) => {
                    const tags = !(data.toptags && data.toptags.tag)
                        ? ''
                        : `[Tags: ${_.map(data.toptags.tag, (tag) => tag.name).slice(0, 5).join(', ')}]`;

                    return `${username} ${np}: ${artist} - ${track.name} ${tags}`;
                });
        });
}

export default function (bot) {
    const ENDPOINT = bot.config.lastfm.endpoint;
    const API_KEY = bot.config.lastfm.apikey;
    const getNP = _.partial(getNowPlaying, ENDPOINT, API_KEY);

    bot.on('cmd_np', (nick, to, text) => {
        getNP(text)
            .then((msg) => bot.say(to, msg))
            .catch((err) => bot.say(to, err.message));
    });
};
