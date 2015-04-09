export default function (bot) {
	bot.on('registered', (message) => {
		if (bot.config.identify) {
			bot.say('NickServ', `IDENTIFY ${bot.config.password}`);
        }
    });
};
