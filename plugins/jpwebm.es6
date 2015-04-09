import request from 'request';
import LRU from 'lru-cache';
import _ from 'lodash';

Promise.promisifyAll(request);
const webms = LRU(100);

var bot;

function getThreads() {
    return request.getAsync({
            url: 'http://a.4cdn.org/jp/catalog.json',
            headers: {
                'User-Agent': 'request'
            },
            json: true
        })
        .spread((response, data) => {
            return _(data)
                .map((page, index) => page.threads)
                .flatten()
                .filter((thread) => thread && /akb.*general/i.test(thread.sub))
                .pluck('no')
                .value();
        });
}

function getWebMs(thread) {
    return request.getAsync({
            url: 'http://a.4cdn.org/jp/thread/' + thread + '.json',
            headers: {
                'User-Agent': 'request'
            },
            json: true
        })
        .spread((response, data) => {
            return _(data.posts)
            .filter((post) => {
                if (post.ext === '.webm' && !webms.get(post.md5)) {
                    webms.set(post.md5, post);

                    return true;
                }

                return false;
            })
            .value();
        });
}

function run() {
    return getThreads()
        .map(getWebMs)
        .then((webmlist) => {
            return _(webmlist)
            .flatten()
            .sortBy('no')
            .value();
        })
        .then((webmlist) => {
            if (!isFirstRun || webmlist.length === 0) return webmlist;

            isFirstRun = false;

            return [webmlist.pop()];
        })
        .map((post) => {
            bot.say('#SecretBase', `[WebM] http://i.4cdn.org/jp/${post.tim}${post.ext} - ${post.filename}`);
        })
        .delay(60000)
        .catch((error) => {
            console.error('[jpwebm]', '\n' + error.stack);
        })
        .then(run);
}

let isFirstRun = true;

Promise.delay(10000).then(run);

export default function (b) {
    bot = b;

    const fn = function (nick, to, text) {
        return request.getAsync({
                url: 'http://a.4cdn.org/jp/catalog.json',
                headers: {
                    'User-Agent': 'request'
                },
                json: true
            })
            .spread((response, data) => {
                return _(data)
                    .map((page, index) => page.threads)
                    .flatten()
                    .filter((thread) => thread && /akb.*general/i.test(thread.sub))
                    .sortBy('no')
                    .value()
                    .pop();
            })
            .then((thread) => {
                bot.say(to, `[AKB General] http://boards.4chan.org/jp/thread/${thread.no}/${thread.semantic_url} - ${thread.sub}`);
            });
    };

    bot.on('cmd_akb', fn);
    bot.on('cmd_akb48', fn);
    bot.on('cmd_akbgen', fn);
    bot.on('cmd_akb48gen', fn);
    bot.on('cmd_akbgeneral', fn);
    bot.on('cmd_akb48general', fn);
};
