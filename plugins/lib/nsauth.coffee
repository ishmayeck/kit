# Plugin responsible for authenticating owners against NickServ.
# Plugins that perform administrative functions may use this to 
# validate bot owners. A nick must be in the owners array in the
# config file and be identified (STATUS == 3) to be recognized.
# Note: this is not a "classic" plugin, in that it is meant to be
# included and used by way of its exports.authorize method.

@bot = false
# TODO: I'd like to cache the response, but it would be
# risky without somehow watching for the user to disconnect
# and resetting the authorization, or some such. Too much
# trouble for the moment.

auth = (nick)->
	def = q.defer()
	unless nick in bot.config.owners
		def.reject('But you are not my master!')

	bot.on 'notice', (from, to, text)->
		if from == 'NickServ' and text == "STATUS #{nick} 3"
			def.resolve()
		else
			def.reject('Try identifying to NickServ.')

	bot.say 'NickServ', "STATUS #{nick}"
	return def.promise

module.exports = (bot)->
	@bot = bot

	authorize: (msg)->
		if typeof(msg) == 'string'
			nick = msg
		else
			nick = msg.nick
		auth(nick).fail(
			(errmsg)->
				bot.say msg.args[0], errmsg
				this.reject()
		)
