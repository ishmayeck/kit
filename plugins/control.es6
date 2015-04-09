import child_process from 'child_process';

Promise.promisifyAll(child_process);

export default function (bot) {
    const authorize = require('./lib/nsauth')(bot);

    bot.on('cmd_reload', (nick, to, text, message) => {
        authorize(message)
            .then(() => bot.reload())
            .catch((err) => bot.say(to, err.message));
    });

    bot.on('cmd_quit', (nick, to, text, message) => {
        authorize(message)
            .then(() => bot.disconnect('I OBEY!'))
            .catch((err) => bot.say(to, err.message));
    });

    bot.on('cmd_eval', (nick, to, text, message) => {
        const say = bot.say.bind(bot, to);

        authorize(message).then(() => eval(text))
            .then((text) => bot.say(to, text))
            .catch((text) => bot.say(to, text));
    });

    bot.on('cmd_update', (nick, to, text, message) => {
        authorize(message).then(() => {
            return child_process.execAsync('git pull').spread((stdout, stderr) => {
                if (stderr) throw new Error(stderr);

                bot.say(to, stdout);
                bot.reload();
            })
            .catch((err) => bot.say(to, err.message));
        });
    });
};
