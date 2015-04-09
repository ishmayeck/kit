// Weather from Google
import request from 'request';
import cheerio from 'cheerio';
import _ from 'lodash';


Promise.promisifyAll(request);

const headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'
};

function getWeather(loc) {
    return request.getAsync({
            uri: 'http://google.com/search',
            qs: {
                q: `Weather+${encodeURIComponent(loc)}`,
                sourceid: 'chrome'
            },
            headers
        })
        .spread((res, body) => {
            const $ = cheerio.load(body);

            // Sometimes C and F get inverted. I don't know why.
            const t1 = _.parseInt($('#wob_ttm').text(), 10);
            const t2 = _.parseInt($('#wob_tm').text(), 10);

            // This will break for temps < -40 :)
            const c = Math.min(t1, t2);
            const f = Math.max(t1, t2);

            const location = $('.wob_hdr .vk_h').text();

            if (!location) throw new Error('no location');

            return {
                location: location,
                cond: $('#wob_dc').text(),
                c: c,
                f: f
            };
        });
}

export default function (bot) {
    bot.on('cmd_temp', (nick, to, text) => {
        getWeather(text)
            .then(({ location, cond, c, f }) => {
                bot.say(to, `${cond}, ${irc.colors.wrap('bold', `${c}°C | ${f}°F`)} in ${location}`);
            })
            .catch((err) => bot.say(to, `Error fetching weather information: ${err.message}`));
    });
};
