# twitter plugin - fetches entire Twitter messages from links posted in channel

# gruber revised expression - http://rodneyrehm.de/t/url-regex.html
uri_pattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;

twitter_pattern = /^https?:\/\/(www.)?twitter.com\/(.*)\/status\/(.*)$/i
twitter = require('twitter-api').createClient()


module.exports = (bot)->
  twitter.setAuth bot.config.twitter_auth[0],
    bot.config.twitter_auth[1],
    bot.config.twitter_auth[2],
    bot.config.twitter_auth[3]

  bot.on 'message', (nick, to, text)->
    uris = text.match(uri_pattern)
    for k, uri of uris
      if uri.match(twitter_pattern) isnt null
        t = twitter_pattern.exec uri
        twitter.get "statuses/show/" + t[3], {}, (response, err, code)->
          if code is 200
            bot.say to, "#{irc.colors.wrap('bold', response.user.name)} / @#{irc.colors.wrap('bold', response.user.screen_name)} #{response.text}"
