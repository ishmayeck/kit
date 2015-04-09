export default function (bot) {
    bot.on('cmd_o', (nick, to, text) => {
        bot.say(to, text.replace(/[aeiu]/g, 'o').replace(/[AEIU]/g, 'O'));
    });
};
