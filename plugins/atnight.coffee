
module.exports = (bot)->
  bot.on 'message', (nick, to, text)->
    if nick == 'Lily' and text.match /I'm SO afraid, to go out./
      bot.say to, "At night :3"
    if nick == 'Lily' and text.match /I'm so scared ;_;/
      bot.say to, "At night @_@"