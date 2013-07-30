


module.exports = (bot)->
	bot.on 'registered', (message)->
		if bot.config.identify? and bot.config.identify
			bot.say 'NickServ', "IDENTIFY #{bot.config.password}"
