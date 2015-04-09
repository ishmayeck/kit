export default function (bot) {
    bot.on('message', (nick, to, text) => {
        if (nick !== 'Lily') return;

        if (text === 'I\'m SO afraid, to go out.') {
            bot.say(to, 'At night :3');
        }
        if (text === 'I\'m so scared ;_;') {
            bot.say(to, 'At night @_@');
        }
    });
};
