module.exports = function (bot) {
    bot.on("cmd_pls", function (nick, to, text) { 
        bot.say(to, "fk suck noob " + nick);
    });
};
