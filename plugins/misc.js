module.exports = function (bot) {
    bot.on('cmd_usoda', function (nick, to, text) { 
        bot.say(to, 'http://usoda.tyscorp.net/');
    });

    bot.on('cmd_aamin', function (nick, to, text) { 
        bot.say(to, 'http://a.pomf.se/cxxdnu.webm');
    });

    bot.on('cmd_da', function (nick, to, text) { 
        bot.say(to, 'http://a.pomf.se/pvegjf.webm');
    });
};