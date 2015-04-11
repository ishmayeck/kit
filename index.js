global.Promise = require('bluebird');
global.irc = require('irc');

Promise.promisifyAll(require('fs'));

require('babel/register')({
    extensions: ['.es6']
});

require('./app');
