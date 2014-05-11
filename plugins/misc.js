module.exports = function (bot) {
    bot.on('cmd_usoda', function (nick, to, text) { 
        bot.say(to, 'http://feati.funpic.de/usoda.html');
    });
};