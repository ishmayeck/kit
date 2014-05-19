module.exports = function (bot) {
    bot.on('cmd_o', function (nick, to, text) {
        var t = text.replace(/[aeiu]/g, 'o').replace(/[AEIU]/g, 'O');
        bot.say(to, t);
    });
};
