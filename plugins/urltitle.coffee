# urltitle - fetches page titles from URLs posted in channel

# gruber revised expression - http://rodneyrehm.de/t/url-regex.html
uri_pattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
twitter_pattern = /^https?:\/\/(www.)?twitter.com\/(.*)\/status\/(.*)$/i
cheerio = require 'cheerio'
http = require 'http'
https = require 'https'
request = require 'request'


get_uri = (u, cb)->

  # request headers in case it's an image, so we don't fetch the whole thing
  request
    method: 'HEAD'
    uri: u
  , (err, res, body)->
      if err then console.log err; return
      if !res.headers['content-type'].match /text\/html/
        if cb? then cb(res, null)
      else
        # we good, let's get it
        request
          uri: u
        ,
        (err, res, body)->
          if err then console.log err; return
          if cb? then cb(res, body)

get_title = (html, cb)->
  $ = cheerio.load html
  if cb? then cb $('title').text().replace /\s$/, ''


module.exports = (bot)->
  bot.on 'message', (nick, to, text)->
    uris = text.match(uri_pattern)
    for k, uri of uris
      if uri.match(twitter_pattern) and !bot.config.blacklist?.twitter then return # How hidous.
      get_uri uri, (res, data)->
        ct = res.headers['content-type']
        if ct.match /text\/html/
          get_title data, (title)->
            bot.say to, "#{irc.colors.wrap('bold', title)} - #{uri}"
        else
          #bot.say to, 'is an image or something!'
  bot.on 'cmd_wall', (nick, to, text)-> # TODO: not here
    bot.say to, 'Kit now serves up the future of URL parser at http://ishmayeck.com:3000/. Still very broken prototype. pls no IE.'
