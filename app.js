require('coffee-script');
irc = require('irc')
var fs = require('fs')
    , e = require('events')
    , async = require('async');
_ = require('underscore');

irc.colors.codes.bold = '\u0002';
irc.colors.codes.underline = '\u001f';


var Bot = require('./bot');

does = [];
nets = [];
fs.readdir('./servers', function(err, files){
    _.each(files, function(file){
        does.push(function(done) {
            var b = new Bot(file).on('loaded', function() {
                done();
            });
            if(!b.config.enabled) {
                done()
            } else {
                nets.push(b);
            }
        });
    });
    async.series(does, function() {
        console.log("- All done");
        require('./webui');
    });
});
