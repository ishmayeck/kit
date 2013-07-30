says_things = [
  "I'll gwizzle your gwonk if you're not careful maaaaate",
  "The map screen of the iPhone is what.",
  "The map screen of the iPhone is amusing somehow.",
  "I never burn, I am a shining light!",
  "These why humanity invent the clothes.",
  "And holy shit does this song reflect the thoughts of how you feel.",
  "The body shudders to recall it still.",
  "This game looks fun, if you like bad things.",
  "There's a lot of stupid things in everything.",
  "The foolish name of you is trivial.",
  "If the life is regrettable, not having approached me any longer.",
  "You can consider this as the best news on my life !! seriously !!",
  "Best fuck up cunt or I hook ya in the gabber",
  "веселенькая группа, под неё я много народу напугал."
]
gratefuls = [
  "I-it's not like I did it for you! baka!!",
  "(　｀ー´)八(｀ー´　) ＨＩ５",
  "Yes I am.",
  "yaw, don't mention it bro",
  "it's what I do. ┐(￣ー￣)┌",
  "n-np..."
]

module.exports = (bot)->
  bot.on 'cmd_kit', (nick, to, text)->
    bot.say to, 'yes I am.'
  bot.on 'message', (nick, to, text)->
    if text.toLowerCase().match(/kit/)
      if Math.random()*4 > 3
        bot.say to, says_things[Math.floor(Math.random()*says_things.length)];
  bot.on 'cmd_thanks', (nick, to, text)->
    bot.say to, gratefuls[Math.floor(Math.random()*gratefuls.length)];
  bot.on 'cmd_choose', (nick, to, text, message)->
    if text.indexOf(',') > -1
      arr = text.split ','
    else if text[text.length-1] == '?'
      # simple question, delegate to 8ball.
      # Undefined behavior if 8ball plugin isn't loaded.
      bot.emit 'cmd_8ball', nick, to, text, message
      return
    else if (matches = text.match(/(\d+)\ ?\-\ ?(\d+)/))
      one = parseInt matches[1]
      two = parseInt matches[2]
      if one < two
        min = one; max = two
      else
        min = two; max = one
      console.log 'min: ' + min
      console.log 'max: ' + max
      result = Math.floor Math.random() * (max - min) + min
      bot.say to, nick + ': ' + result
      return
    else
      arr = text.split ' '
    bot.say to, nick + ': ' + arr[Math.floor(Math.random()*arr.length)];
