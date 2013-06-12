module.exports =
  enabled: false
  nick: 'Kit'
  server: 'irc.somewhere.net'
  cmdprefix: '!'
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
    userName: 'kit'
    realName: 'bot'
