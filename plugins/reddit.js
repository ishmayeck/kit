// fuck your coffeeshit
var uri_pattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
var reddit_pattern = /^https?:\/\/(www.)?reddit.com\/r\/(.*?)\/comments\/(.*?)\/(.*)$/i;
var request = require("request");

// TODO: remove dependency on irc - this should be entirely IRC library agnostic
var irc = require('irc');
  
module.exports = function (app) {
    app.msg('PRIVMSG', function(req, res) {
        var uris = req.text.match(uri_pattern);

        for (var k in uris) {
            var uri = uris[k];
            if (reddit_pattern.test(uri)) {
                request({
                    method: "GET",
                    uri: uri + "/.json",
                    json: true
                }, function (error, response, body) {
                    if (!error) {
                        var info = body[0].data.children[0].data;
                        var msg = "";

                        if (info.domain === "self." + info.subreddit) {
                            msg = irc.colors.wrap("bold", "/r/" + info.subreddit + " : " + info.title) + " "
                                + info.selftext.replace(/\n/g, "\u00A0").substr(0, 126) + "...";
                        }
                        else {
                            msg = irc.colors.wrap("bold", "/r/" + info.subreddit + " : " + info.title) + " " + info.url;
                        }

                        res.say(msg);
                    }
                });
            }
        }
    });
};
