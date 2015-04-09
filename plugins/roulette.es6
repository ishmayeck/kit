// In using this plugin Kit assumes it is opped.

export default function (bot) {
    bot.on('cmd_roulette', (nick, to, text) => {
        if (Math.floor(Math.random() * 6) > 4) {
            bot.say(to, 'You win roulette! Here, wear the happy hat.');
            bot.send('MODE', to, '+o', nick);
        }
        else {
            bot.send('kick', to, nick, `You lose! And if Ishy wasn't too lazy to give me ban timers, you'd be banned!`);
        }
    });
};
