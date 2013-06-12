# Global configuration file
# for things that are global

# Twitter API credentials. The twitter.setAuth function takes 4 arguments.
# I don't know what they are, but they go here.
module.exports =
  twitter_auth: [
    "diT43ujeOrblo8Af2nKOg",
    "FO3pmN6HyflJ0lofdUR8YI7Eh0hvOrRjwa4sSzaa4",
    "39262742-b0YljzrCXcNf4HYneQblhOlKe6FtXolmSOZzYctX1",
    "vdn5nP7sp9pEK6dZF6PWYNuYGwoEDdXkJNR008DsLA"
  ]

# MongoDB settings, currently used by URL catcher plugin
  mongodb:
    host: '127.0.0.1'
    db: 'kit'

  lastfm:
    apikey: '59101a5331a8fdb4adac50a6b9d27c8b'
    endpoint: 'http://ws.audioscrobbler.com/2.0/'
