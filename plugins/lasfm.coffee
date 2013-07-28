apiroot = ''
apikey = ''
request = require 'request'
url = require 'url'

getNowPlaying = (user, cb)->
  request
    uri: apiroot
    qs:
      method: 'user.getrecenttracks'
      user: encodeURIComponent user
      api_key: apikey
      format: 'json'
  , (err, res, body)->
      t = JSON.parse body
      if t.error? then cb('Unspecified error.'); return
      unless t.recenttracks? and t.recenttracks.track? and t.recenttracks.track.length?
        cb(user + " doesn't appear to have played anything.")
        return
      tr = t.recenttracks.track[0]
      if !tr? then return
      if tr['@attr']? and tr['@attr'].nowplaying
        beg = "now playing"
      else
        beg = "last played"
      ar = tr.artist['#text']
      strang = "#{ar} - #{tr.name}"
      request
        uri: apiroot
        qs:
          method: 'track.getTopTags'
          artist: ar
          track: tr.name
          api_key: apikey
          user: user
          format: 'json'
      , (err, res, body)->
          tags = JSON.parse body
          if tags.toptags? and tags.toptags.tag?
            ts = for tag in tags.toptags.tag
              tag.name
            ts = ts[0..3].join(', ')
            ts = ' [ Tags: ' + ts + ']'
          else ts = ''
          cb "#{t.recenttracks['@attr'].user} #{beg}: #{strang} #{ts}"


module.exports = (bot)->
  apiroot = bot.config.lastfm.endpoint
  apikey = bot.config.lastfm.apikey

  bot.on 'cmd_np', (nick, to, text)->
    getNowPlaying text, (text)->
      bot.say to, text
