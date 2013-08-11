
module.exports = (bot)->
  bot.on 'message', (nick, to, text)->
    if nick == 'Lily' and text == "I'm SO afraid, to go out."
      bot.say "At night :3"
    if nick == 'Lily' and text == "I'm so scared ;_;"
      bot.say "At night @_@"