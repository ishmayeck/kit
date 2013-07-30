module.exports = (bot)->
  auth = require('./lib/nsauth')(bot)
  
  bot.on 'cmd_reload', (shit..., message)->
    auth.authorize(message).then ->
      bot.reload()

  bot.on 'cmd_quit', (shit..., message)->
    auth.authorize(message).then ->
      bot.disconnect 'I OBEY!'

  bot.on 'cmd_eval', (nick, to, text, message)->
    auth.authorize(message).then ->
      try
        bot.say to, eval(text)
      catch e
        bot.say to, e
        console.log e

  bot.on 'cmd_update', (nick, to, text, message)->
    auth.authorize(message).then ->
      require('child_process').exec 'git pull', (e, out, err)->
        if e?
          console.log e
          bot.say to, 'Internal error.'
          return
        bot.say to, out
        bot.reload()
