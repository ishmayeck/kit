import request from 'request';

Promise.promisifyAll(request);

const uri_pattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
const reddit_pattern = /^https?:\/\/(www.)?reddit.com\/r\/(.*?)\/comments\/(.*?)\/(.*)$/i;
  
export default function (bot) {
    bot.on('message', (nick, to, text) => {
        const uris = text.match(uri_pattern) || [];

        Promise.filter(uris, (uri) => reddit_pattern.test(uri))
            .map((uri) => {
                return request.getAsync({
                        uri: `${uri}/.json`,
                        json: true
                    })
                    .spread((response, body) => {
                        const info = body[0].data.children[0].data;
                        const subredditTitle = irc.colors.wrap('bold', `/r/${info.subreddit} : ${info.title}`);
                        
                        if (info.domain === 'self.' + info.subreddit) {
                            const preview = info.selftext.replace(/\n/g, "\u00A0").substr(0, 126);

                            return `${subredditTitle} ${preview}` + (preview.length > 125 ? '...' : '');
                        }
                        else {
                            return `${subredditTitle} ${info.url}`;
                        }
                    })
                    .then((msg) => bot.say(to, msg))
                    .catch(function ignoreError() {});
            });
    });
};
