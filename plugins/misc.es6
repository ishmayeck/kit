export default function (bot) {
    bot.on('cmd_aamin', (nick, to, text) => { 
        bot.say(to, 'http://a.pomf.se/cxxdnu.webm');
    });

    bot.on('cmd_da', (nick, to, text) => { 
        bot.say(to, 'http://a.pomf.se/pvegjf.webm');
    });

    bot.on('cmd_brthday', (nick, to, text) => { 
        bot.say(to, 'http://a.pomf.se/vgwjin.mp4');
    });
};
