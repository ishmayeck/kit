global.Promise = require('bluebird');
global.irc = require('irc');

require('babel/register')({
    extensions: ['.es6']
});

require('./app');
