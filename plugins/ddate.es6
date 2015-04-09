import DDate from 'ddate';

export default function (bot) {
    bot.on('cmd_ddate', (nick, to) => {
        bot.say(to, `Today is ${new DDate().toOldImmediateDateFormat()}`);
    });
};
