// fuck your coffeeshit
var request = require("request");
var cheerio = require("cheerio");
  
module.exports = function (bot) {
	bot.on("cmd_esports", function (nick, to, text) {
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
				
				bot.say(to, irc.colors.wrap("bold", title + " : ") + url);
			}
			else {
				bot.say(to, "No esports :(");
			}
		});
	});
};
