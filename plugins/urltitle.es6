// urltitle - fetches page titles from URLs posted in channel

import cheerio from 'cheerio';
import request from 'request';
import _ from 'lodash';

Promise.promisifyAll(request);

// gruber revised expression - http://rodneyrehm.de/t/url-regex.html
const uri_pattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
const twitter_pattern = /^https?:\/\/(www.)?twitter.com\/(.*)\/status\/(.*)$/i;
const reddit_pattern = /^https?:\/\/(www.)?reddit.com\/r\/(.*?)\/comments\/(.*?)\/(.*)$/i;
const facebook_pattern = /^https?:\/\/(www.)?facebook.com/;

function getUri(uri) {
    return request.headAsync(uri)
        .spread((res, body) => {
            if (res.headers['content-type'] && !/text\/html/i.test(res.headers['content-type'])) {
                throw new Error('not HTML');
            }
        })
        .then(() => request.getAsync(uri))
        .spread((res, body) => {
            if (res.headers['content-type'] && !/text\/html/i.test(res.headers['content-type'])) {
                throw new Error('not HTML');
            }

            if (res.statusCode !== 200) {
                throw new Error('not 200');
            }

            return body;
        });
}

const getTitle = Promise.method(function (html) {
    const $ = cheerio.load(html);

    return $('title').text().replace(/\s$/, '').replace(/(\n|\r)/g, ' ');
});

export default function (bot) {
     bot.on('message', (nick, to, text) => {
        const uris = text.match(uri_pattern) || [];

        Promise.resolve(uris)
            .filter((uri) => !twitter_pattern.test(uri) || bot.config.blacklist.twitter)
            .filter((uri) => !reddit_pattern.test(uri) || bot.config.blacklist.reddit)
            .filter((uri) => !facebook_pattern.test(uri))
            .map(getUri)
            .map(getTitle)
            .map((title) => {
                bot.say(to, `${irc.colors.wrap('bold', title)}`);
            })
            .catch(console.error);
    });
};
