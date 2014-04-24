var DDate = require('ddate');

module.exports = function(bot) {
    bot.on('cmd_ddate', function(nick, to) {
        bot.say(to, 'Today is ' + new DDate().toOldImmediateDateFormat());
    });
};
