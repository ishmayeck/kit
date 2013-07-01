# Weather from Google
request = require 'request'
cheerio = require 'cheerio'
moment = require 'moment'
async = require 'async'

get_weather = (loc, cb)->
  request
    uri: "http://google.com/search"
    qs:
      q: "Weather+#{encodeURIComponent loc}"
      sourceid: "chrome"
    headers:
      'User-Agent': 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'
  , (err, res, body)->
      if err? then console.log err; return
      $ = cheerio.load body

      # Sometimes C and F get inverted. I don't know why.
      c = parseInt $('#wob_ttm').text()
      f = parseInt $('#wob_tm').text()
      unless c < -40 or f < -40
        if c > f
          a = f
          f = c
          c = a

      w =
        location: $('.wob_hdr .vk_h').text()
        current:
          cond: $('#wob_dc').text()
          c: c
          f: f
      unless w.location then err = true
      cb(err, w)


current_weather = (loc, cb)->
  get_weather loc, (err, w)->
    if err? then msg = 'Error fetching weather information.'
    msg = "#{w.current.cond}, " + irc.colors.wrap('bold', "#{w.current.c}°C | #{w.current.f}°F") + " in #{w.location}"
    cb msg


module.exports = (bot)->
  bot.on 'cmd_temp', (nick, to, args)->
    current_weather args, (msg)->
      bot.say to, msg
