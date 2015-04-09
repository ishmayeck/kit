import request from 'request';
import cheerio from 'cheerio';

Promise.promisifyAll(request);
  
export default function (bot) {
    bot.on('cmd_esports', (nick, to, text) => {
        request.getAsync('http://na.lolesports.com/')
            .spread((response, body) => {
                const $ = cheerio.load(body);
                const youtube = $('#youtube iframe');
                
                if (youtube.length > 0) {
                    const title = $('#youtube iframe').attr('title');
                    const url = 'http://www.youtube.com/watch?v=' + /embed\/(.*?)\?/.exec($('#youtube iframe').attr('src'))[1];
                    
                    bot.say(to, irc.colors.wrap('bold', `${title}: `) + url);
                }
                else {
                    bot.say(to, 'No esports :(');
                }
            });
    });
};
