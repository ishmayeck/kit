var irc = require('irc')
    , fs = require('fs')
    , _ = require('lodash')
    , zygoat = require('../zygoat');

irc.colors.codes.bold = '\u0002';
irc.colors.codes.underline = '\u001f';

var app = zygoat();

var client = new irc.Client('irc.ishmayeck.net', 'Kote', {
    channels: [ '#teste' ]
});

fs.readdir('./plugins', function(err, files){
    _.each(files, function(file){
        require('./plugins/' + file)(app);
    });
});

app.run(client);
