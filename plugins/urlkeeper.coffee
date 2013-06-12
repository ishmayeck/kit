# URL keeper - archives URLs from a channel into mongodb,
# potentially for display in a gallery by webui or something

# gruber revised expression - http://rodneyrehm.de/t/url-regex.html
uri_pattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;

mongo = require 'mongodb'
Db = mongo.Db
Connection = mongo.Connection
Server = mongo.Server
request = require 'request'


class Keeper
  constructor: (bot)->
    @client = Db.connect "mongodb://#{bot.config.mongodb.host}/#{bot.config.mongodb.db}", (err, db)=>
      console.log err or 'URLKeeper connected to mongo'
      @collection = db.collection 'urls'

  log: (u)->
    console.log 'insarting'
    @collection.insert u, (err, docs)->
      if err? then console.log err
      console.log 'insarted'
      console.log docs



module.exports = (bot)->
  keeper = new Keeper(bot)

  bot.on 'message', (nick, to, text)->

    uris = text.match(uri_pattern)
    for k, uri of uris
      # TODO: possibly at some point maybe validate URLs or something
      request
        url: uri
        method: 'HEAD'
        , (err, res, data)->
          if err? then console.log err; return
          ct = res.headers['content-type']
          keeper.log
            type: ct.match /\w+\/\w+/
            net: bot.config.server
            chan: to.toLowerCase()
            url: uri
