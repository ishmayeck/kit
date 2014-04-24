module.exports =
  enabled: true
  nick: 'Kite'
  server: 'irc.ishmayeck.net'

  # Command delimiter.
  # Can also be an array if you want multiple command delimiters
  #cmdprefix: [
  #  '`'
  #  '!'
  #]
  cmdprefix: '`'

  # These are passed directly to the node-irc client
  # This is where you have to specify things like port.
  # I may make it a bit more friendly, someday.
  ircopts:
    channels: [
      '#asdf'
    ]
    autoRejoin: true
    autoConnect: true
    port: 6667
    userName: 'Bot'
    realName: "Look Ma I'm a bot"

  # Whether to use NickServ identification, and the password
  # You must register the nick yourself - too much variance between
  # registration procedures on different servers to do it automatically.
  identify: false
  password: 'himitsu'

  # List of nicks that can use dangerous/administrative things.
  # These nicks must be identified to NickServ to administrate.
  owners: [
    'Ishmayeck'
  ]

  # List of plugins to never load for this server.
  blacklist: [
    'urlkeeper'
  ]
