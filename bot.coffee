fs = require 'fs'
path = require 'path'
_ = require 'underscore'
q = global.q = require 'q'

module.exports = class Bot extends irc.Client

  # connection logic only pls
  constructor: (file)->
    @lstcache = []
    @config = require "./servers/#{file}"
    _.extend(@config, require "./config")
    if @config.enabled == false
      this.emit 'loaded'
      console.log "- Server #{@config.server} is disabled, skipping"
      return false

    console.log "- Starting bot for #{@config.server}"
    super @config.server, @config.nick, @config.ircopts
    this.initialize()

  # All initialization after the thing is connected goes here.
  # This needs to be safe to run on "reload" command
  initialize: ()->
    this.initPlugins()
    this.on 'error', ->
      console.log 'Fatal error caught!'
      console.log arguments
    this.on 'message', this.parseMessage

  initPlugins: ()->
    console.log " - Loading plugins..."
    fs.readdir './plugins', (err, files)=>
      for file in files
        name = path.basename file, path.extname file
        unless @config.blacklist? and name in @config.blacklist
          console.log '  - ' + name
          require("./plugins/#{name}")(this)
      this.emit 'loaded' # require is sync, which makes things easy

  parseMessage: (nick, to, text, message)->
    r = new RegExp "^#{@config.cmdprefix}(\\w+)"
    if r = text.match r
      this.emit "cmd_#{r[1]}", nick, to, text.match(/\w+\ ?(.*$)/)[1], message

  # We need to keep tabs on what listeners the plugins are using, so that we
  # can clear them when we're reloading plugins.
  on: ->
    @lstcache.push arguments[0]
    super

  reload: ->
    console.log '- Reloading...'
    # purge Node require cache so that we re-read all the plugins
    for key in Object.keys require.cache
      delete require.cache[key]
    # we now know that these are plugin/bot listeners, and can be removed
    for ev in @lstcache
      this.removeAllListeners(ev)
    @lstcache = []
    this.initialize()
