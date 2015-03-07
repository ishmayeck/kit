# Time from Google
http = require 'http'
cheerio = require 'cheerio'
moment = require 'moment'
async = require 'async'

gettime = (zone, cb)->
  html = ''
  http.get(
    hostname: 'www.google.com'
    path: "/search?q=Time+in+#{encodeURIComponent zone}&sourceid=chrome"
    headers:
      'User-Agent': 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'
  , (res)->
    res.on 'data', (c)-> html += c
    res.on 'end', ->
      cb(parse html)
  )
    .on 'error', -> console.log arguments

parse = (html)->
  $ = cheerio.load html
  pieces = $('div.vk_gy.vk_sh').text().trim().replace(/\s+/g, ' ').split(' ')
  if pieces.length < 7 then return false;

  # Maybe I should make a Date object instead? mmm...
  hour: pieces[0].split(':')[0]
  minute: pieces[0].split(':')[1]
  ampm: pieces[1]
  weekday: pieces[2].replace /,/, ''
  month: pieces[3]
  day: pieces[4].replace /,/, ''
  year: pieces[4]
  desc: $('span.vk_gy.vk_sh').first().text().trim().replace(/\s+/g, ' ')
  zone: pieces[6].replace /[\(\)]/g, ''

time_text = (time)->
  if time
    irc.colors.wrap('bold', "#{time.hour}:#{time.minute} #{time.ampm}") +
    " #{time.weekday}, #{time.month} #{time.day} (#{time.zone}) - #{time.desc}"
  else
    "Could not find matching time stuff."

time_text_short = (time)->
  if time
    "#{time.hour}:#{time.minute} #{time.ampm} (#{time.zone})"
  else
    "Could not find matching time stuff."

beast = ->
  now = moment().utc().add 'hours', 1
  s = now.seconds() + now.minutes() * 60 + now.hours() * 60 * 60
  b = s / 86.4
  ls = s % 86.4
  rels = ls / 1.2

  beats: Math.round(b)
  rels: ("0" + Math.round(rels)).slice -2

beast_text = ->
  b = beast()
  irc.colors.wrap 'bold', "@#{b.beats}:#{b.rels}"

module.exports = (bot)->

  bot.on 'cmd_time', (nick, to, text)->
    gettime text, (time)=>
      bot.say to, time_text(time)

  bot.on 'cmd_jikan', (nick, to, text)->
    gettime text, (time)=>
      bot.say to, time_text(time)

  bot.on 'cmd_times', (nick, to, text)->
    pc = sv = au = jp = va = ia = 0
    async.parallel [
      (done)-> gettime '74074', (time)->
        pc = time_text_short(time)
        done()
    ,
      (done)-> gettime 'Svalbard', (time)->
        sv = time_text_short(time)
        done()
    ,
      (done)-> gettime 'Japan', (time)->
        jp = time_text_short(time)
        done()
    ,
      (done)-> gettime 'Hobart', (time)->
        au = time_text_short(time)
        done()
    ,
      (done)-> gettime '22401', (time)->
        va = time_text_short(time)
        done()
    ,
      (done)-> gettime 'Jogjakarta', (time)->
        ia = time_text_short(time)
        done()
    ], =>
      bot.say to, 'time in relevant places of the world of it:'
      bot.say to, irc.colors.wrap('bold', 'Mexico: ') + pc + ' || ' + irc.colors.wrap('bold', 'Tanzania, NZ, Austria: ') + au
      bot.say to, irc.colors.wrap('bold', 'Vagina: ') + va + ' || ' + irc.colors.wrap('bold', 'JKT48, India: ') + ia

  bot.on 'cmd_beats', (nick, to, text)->
    bot.say to, beast_text()

  bot.on 'cmd_beast', (nick, to, text)->
    bot.say to, beast_text() + '. rawr!'
