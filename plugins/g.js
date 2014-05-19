module.exports = function (bot) {
    bot.on('cmd_g', function (nick, to, text) {
        bot.say(to, text.replace(/[a-z]/g, 'g').replace(/[A-Z]/g, 'G'));
    });
};
