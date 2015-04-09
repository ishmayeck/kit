export default function (bot) {
    bot.on('cmd_g', (nick, to, text) => {
        bot.say(to, text.replace(/[a-z]/g, 'g').replace(/[A-Z]/g, 'G'));
    });
};
