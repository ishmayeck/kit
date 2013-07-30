# In using this plugin Kit assumes it is opped.

module.exports = (bot)->
  bot.on 'cmd_roulette', (nick, channel, text)->
    unless (Math.floor Math.random() * 6) > 4
      console.log 'no'
      bot.send "kick", channel, nick, "You lose! And if Ishy wasn't too lazy to give me ban timers, you'd be banned!"
    else
      console.log 'yes'
      bot.say channel, "You win roulette! Here, wear the happy hat."
      bot.send "MODE", channel, "+o", nick