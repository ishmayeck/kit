module.exports = function (bot) {
    bot.on('cmd_o', function (nick, to, text) {
        bot.say(to, text.replace(/[aeiu]/g, 'o').replace(/[AEIU]/g, 'O'));
    });
};
