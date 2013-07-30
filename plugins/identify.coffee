


module.exports = (bot)->
	bot.on 'registered', (message)->
		if bot.config.identify? and bot.config.identify
			console.log "IDENTIFY #{bot.config.password}"
			bot.say 'NickServ', "IDENTIFY #{bot.config.password}"

	bot.on 'privmsg', ->
		console.log arguments