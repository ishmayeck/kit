export default function (bot) {
    bot.on('cmd_pls', (nick, to, text) => { 
        bot.say(to, `fk suck noob ${nick}`);
    });
};
