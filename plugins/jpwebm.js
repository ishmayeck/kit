var Promise = require('bluebird');
var _ = require('lodash');
var request = Promise.promisifyAll(require("request"));
var LRU = require('lru-cache');
var webms = LRU(100);

var bot;

function getThreads () {
    return request.getAsync({
        url: 'http://a.4cdn.org/jp/catalog.json',
        headers: {
            'User-Agent': 'request'
        },
        json: true
    })
    .spread(function (response, data) {
        return _(data)
        .map(function (page, index) {
            return page.threads;
        })
        .flatten()
        .filter(function (thread) {
            return /akb.*general/i.test(thread.sub);
        })
        .pluck('no')
        .value();
    });
}

function getWebMs (thread) {
    return request.getAsync({
        url: 'http://a.4cdn.org/jp/thread/' + thread + '.json',
        headers: {
            'User-Agent': 'request'
        },
        json: true
    })
    .spread(function (response, data) {
        return _(data.posts)
        .filter(function (post) {
            if (post.ext === '.webm' && !webms.get(post.md5)) {
                webms.set(post.md5, post);

                return true;
            }

            return false;
        })
        .value();
    });
}

function run () {
    getThreads()
    .map(getWebMs)
    .then(function (webmlist) {
        return _(webmlist)
        .flatten()
        .sortBy('no')
        .value();
    })
    .then(function (webmlist) {
        if (!isFirstRun) return webmlist;

        isFirstRun = false;

        return [webmlist.pop()];
    })
    .map(function (post) {
        bot.say('#SecretBase', '[WebM] http://i.4cdn.org/jp/' + post.tim + post.ext + ' - ' + post.filename);
    })
    .delay(60000)
    .then(run, run);
}

isFirstRun = true;

run();

module.exports = function (b) {
    bot = b;
};
