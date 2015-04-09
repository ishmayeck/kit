import request from 'request';
import cheerio from 'cheerio';
import moment from 'moment';
import _ from 'lodash';

Promise.promisifyAll(request);

const headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'
};

function parseTime(time) {
    return irc.colors.wrap('bold', `${time.hour}:${time.minute} ${time.ampm}`) +
    ` ${time.weekday}, ${time.month} ${time.day} (${time.zone}) - ${time.desc}`
}

function parseTimeShort(time) {
    return `${time.hour}:${time.minute} ${time.ampm} (${time.zone})`;
}

function parseHTML(html) {
    return Promise.try(() => {
        const $ = cheerio.load(html);
        const pieces = $('div.vk_gy.vk_sh').text().trim().replace(/\s+/g, ' ').split(' ');

        if (pieces.length < 7) {
            throw new Error('pieces.length < 7');
        }

        // Maybe I should make a Date object instead? mmm...
        return {
            hour: pieces[0].split(':')[0],
            minute: pieces[0].split(':')[1],
            ampm: pieces[1],
            weekday: pieces[2].replace(/,/, ''),
            month: pieces[3],
            day: pieces[4].replace(/,/, ''),
            year: pieces[4],
            desc: $('span.vk_gy.vk_sh').first().text().trim().replace(/\s+/g, ' '),
            zone: pieces[6].replace(/[\(\)]/g, ''),
        };
    });
}

function getTimeForZone(zone) {
    return request.getAsync({
            uri: 'http://www.google.com/search',
            qs: {
                q: `Time+in+${encodeURIComponent(zone)}`,
                sourceid: 'chrome'
            },
            headers
        })
        .spread((res, body) => parseHTML(body))
        .catch(() => {
            throw new Error('Could not find matching time stuff.');
        });
}

function getTime(text) {
    return getTimeForZone(text)
        .then(parseTime);
}

function getAllTimes(nick, to, text) {
    const times = [
        ['74074', 'Mexico'],
        ['Hobart', 'Tanzania, NZ, Austria'],
        ['22401', 'Vagina'],
        ['Jogjakarta', 'JKT48, India']
    ];

    return Promise.map(times, ([zone, name]) => {
            return getTimeForZone(zone)
                .then(parseTimeShort)
                .then((time) => {
                    return irc.colors.wrap('bold', `${name}: `) + time;
                });
        })
        .then((times) => {
            const timesFormatted =  _.map(_.chunk(times, 2), (c) => {
                return c.join(' || ');
            }).join('\n');

            return `time in relevant places of the world of it:\n ${timesFormatted}`;
        });
}

function getCurrentBeats() {
    const now = moment().utc().add('hours', 1);
    const s = now.seconds() + now.minutes() * 60 + now.hours() * 60 * 60;
    const b = s / 86.4;
    const ls = s % 86.4;
    const rels = ls / 1.2;

    return {
        beats: Math.round(b),
        rels: ("0" + Math.round(rels)).slice(-2)
    };
}

function getBeats() {
    const { beats, rels } = getCurrentBeats();

    return irc.colors.wrap('bold', `@${beats}:${rels}"`);
}

function getBeast() {
    return `${getBeats()}. rawr!`;
}

function sendMessage(bot, fn) {
    return function (nick, to, text) {
        fn(text)
            .then((msg) => bot.say(to, msg))
            .catch((msg) => bot.say(to, msg));
    };
}

export default function (bot) {
    const send = _.partial(sendMessage, bot);

    bot.on('cmd_time', send(getTime));
    bot.on('cmd_jikan', send(getTime));
    bot.on('cmd_times', send(getAllTimes));
    bot.on('cmd_beats', send(getBeats));
    bot.on('cmd_beast', send(getBeast));
};
