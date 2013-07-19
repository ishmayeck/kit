module.exports =
  enabled: false
  nick: 'Kit'
  server: 'irc.somewhere.net'

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
      '#channel1'
      '#channel2'
    ]
    autoRejoin: true
    autoConnect: true
    port: 6667
    userName: 'Bot'
    realName: "Look Ma I'm a bot"

  # List of nicks that can use dangerous/administrative things.
  # These nicks must be identified to NickServ to administrate.
  owners: [
    'Yournick'
  ]

  # List of plugins to never load for this server.
  blacklist: [
    'urlkeeper'
  ]
