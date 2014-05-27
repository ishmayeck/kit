var request = require("request");
var cheerio = require("cheerio");
  
module.exports = function (app) {
	app.cmd('esports', function(req, res) {
        request({
                method: "GET",
                uri: "http://na.lolesports.com/",
            },
            function (error, response, body) {
                $ = cheerio.load(body)
                var youtube = $("#youtube iframe");
                if (youtube.length > 0) {
                    var title = $("#youtube iframe").attr("title");
                    var url = "http://www.youtube.com/watch?v=" + /embed\/(.*?)\?/.exec($("#youtube iframe").attr("src"))[1];

                    res.say(irc.colors.wrap("bold", title + " : ") + url);
                }
                else {
                    res.say("No esports :(");
                }
            });
    });
};
