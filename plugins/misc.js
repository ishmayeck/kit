module.exports = function (bot) {
    bot.on('cmd_usoda', function (nick, to, text) { 
        bot.say(to, 'http://feati.funpic.de/usoda.html');
    });

    bot.on('cmd_aamin', function (nick, to, text) { 
        bot.say(to, 'http://feati.funpic.de/aamin.html');
    });
};