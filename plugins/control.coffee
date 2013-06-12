module.exports = (bot)->
  bot.on 'cmd_reload', ->
    bot.reload()

  bot.on 'cmd_quit', ->
    bot.disconnect 'I OBEY!'

  bot.on 'cmd_eval', (nick, to, text)->
    try
      bot.say to, eval(text)
    catch e
      bot.say to, e
      console.log e
