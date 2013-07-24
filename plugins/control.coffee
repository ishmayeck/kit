module.exports = (bot)->
  auth = require('./lib/nsauth')(bot)
  
  bot.on 'cmd_reload', (shit..., message)->
    auth.authorize(message).then ->
      bot.reload()

  bot.on 'cmd_quit', (shit..., message)->
    authorize(message).then ->
      bot.disconnect 'I OBEY!'

  bot.on 'cmd_eval', (nick, to, text, message)->
    auth.authorize(message).then ->
      try
        bot.say to, eval(text)
      catch e
        bot.say to, e
        console.log e
