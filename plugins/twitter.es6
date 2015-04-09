// twitter plugin - fetches entire Twitter messages from links posted in channel

import Twitter from 'twitter';
import _ from 'lodash';

Promise.promisifyAll(Twitter.prototype);

// gruber revised expression - http://rodneyrehm.de/t/url-regex.html
const uri_pattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
const twitter_pattern = /^https?:\/\/(www.)?twitter.com\/(.*)\/status\/(.*)$/i

export default function (bot) {
    const client = new Twitter(bot.config.twitter_auth);

    bot.on('message', (nick, to, text) => {
        const uris = text.match(uri_pattern) || [];

        Promise.filter(uris, (uri) => twitter_pattern.test(uri))
            .map((uri) => {
                const t = twitter_pattern.exec(uri);

                return client.getAsync(`statuses/show/${t[3]}`)
                    .get(0)
                    .then((tweet) => {
                        const bold = _.partial(irc.colors.wrap, 'bold');

                        bot.say(to, `[Twitter] ${bold(tweet.user.name)} / @${bold(tweet.user.screen_name)} ${tweet.text}`);
                    })
                    .catch(console.error);
            });
    });
};
